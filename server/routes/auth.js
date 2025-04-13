import express from 'express';
import { db } from '../firebase-admin.js';

const router = express.Router();

router.post('/sync-user', async (req, res) => {
    const { uid, email, displayName } = req.body;

    try {
        const userRef = db.collection('users').doc(uid);
        const snapshot = await userRef.get();
        if (!snapshot.exists) {
            await userRef.set({ uid, email, displayName });
        }
        res.status(200).json({ message: 'User synced' });
    } catch(error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ message: 'Failed to sync user' });
    }
});

export default router;