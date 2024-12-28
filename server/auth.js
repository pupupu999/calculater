import express from 'express';
import { db } from '../frontend/poker-app/src/pages/firebase.js';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
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

// POST /server/register
router.post('/regist', async (req, res) => {
    const { userid, password } = req.body;

    try {
        // Firestoreの`users`コレクションから同じuseridがないか確認
        const userRefCheck = doc(collection(db, 'users'), userid);
        const userDocCheck = await getDoc(userRefCheck);

        if (userDocCheck.exists()) {
            return res.status(400).json({ message: 'このUserIDはすでに存在しています' });
        }

        // パスワードをハッシュ化
        const hashedPassword = await bcrypt.hash(password, 10);

        // Firestoreの`users`コレクションにユーザー情報を保存
        const userRef = doc(collection(db, 'users'), userid);
        await setDoc(userRef, { userid, password: hashedPassword });
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        res.status(200).json({ message: 'User registered successfully!', user: userData });
    } catch (error) {
        console.error('API Error:', error); // エラー内容をログに出力
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

export default router;