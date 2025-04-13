import express from 'express';
import { checkAuth } from '../middleware/authMiddleware.js';
import { db } from '../firebase-admin.js';

const router = express.Router();

router.get('/mypage', checkAuth, async (req, res) => {
    const uid = req.user.uid;
    const userDoc = await db.collection('users').doc(uid).get();
    res.status(200).json({ user: userDoc.data() });
});

export default router;