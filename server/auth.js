import express from 'express';
import { db } from '../frontend/poker-app/src/pages/firebase.js';
import { collection, doc, getDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

const router = express.Router();

// POST /server/login
router.post('/login', async (req, res) => {
    const { userid, password } = req.body;

    try {
        // Firestoreから該当のユーザー情報を取得
        const userRef = doc(collection(db, 'users'), userid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = userDoc.data();

        // ハッシュ化されたパスワードを検証
        const passwordMatch = await bcrypt.compare(password, userData.password);

        if (passwordMatch) {
            return res.status(200).json({ message: 'Login successful!', user: userData });
        } else {
            return res.status(401).json({ message: 'Invalid password' });
        }
    } catch (error) {
        console.error('API Error:', error); // エラー内容をログに出力
        return res.status(500).json({ message: 'Error during login', error: error.message });
    }
});

export default router;