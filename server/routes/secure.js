import express from 'express';
import { checkAuth } from '../middleware/authMiddleware.js';
import { db } from '../firebase-admin.js';

const router = express.Router();

router.get('/mypage', checkAuth, async (req, res) => {
    const uid = req.user.uid;
    const userDoc = await db.collection('users').doc(uid).get();
    res.status(200).json({ user: userDoc.data() });
});

router.get('/friends', checkAuth, async (req, res) => {
    try {
        console.log('GET /api/secure/friends - Request received');
        const uid = req.user.uid;
        
        // 現在のユーザーのfriendsフィールドを取得
        const userDoc = await db.collection('users').doc(uid).get();
        const userData = userDoc.data();
        const friendUsernames = userData?.friends || [];
        
        // ユーザー名からusersコレクションを検索して、完全なユーザー情報を取得
        const allUsersSnapshot = await db.collection('users').get();
        const friendsData = allUsersSnapshot.docs
            .map(doc => ({ uid: doc.id, ...doc.data() }))
            .filter(user => friendUsernames.includes(user.displayName || user.username));
        
        console.log('GET /api/secure/friends - Success, returning', friendsData.length, 'friends');
        res.status(200).json({ friends: friendsData });
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ message: 'Failed to fetch friends', error: error.message });
    }
});

export default router;