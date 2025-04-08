import express from 'express';
import { checkAuth } from '../middleware/authMiddleware.js';
import firebaseAdmin from '../firebase-admin.js';
import { doc, getDoc } from 'firebase/firestore';

const router = express.Router();
const db = firebaseAdmin.db;

router.get('/mypage', checkAuth, async (req, res) => {
    const uid = req.user.uid;
    const userDoc = await getDoc(doc(db, 'users', uid));
    res.status(200).json({ user: userDoc.data() });
});

export default router;