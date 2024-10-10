// pages/api/register.js
import { db } from '../firebase'; // Firebase設定ファイルからdbをインポート
import { collection, setDoc, doc, getDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    const { userid, password } = req.body;

    if (!userid || !password) {
        res.status(400).json({ message: 'UserIDとpassswordどちらも入力してください' });
    }

if (req.method === 'POST') {
    try {
    // Firestoreの`users`コレクションから同じuseridがないか確認
    const userRefCheck = doc(collection(db, 'users'), userid);
    const userDocCheck = await getDoc(userRefCheck);
    if(userDocCheck.exists()) {
        return res.status(400).json({ message: 'このUserIDはすでに存在しています' });
    }
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // Firestoreの`users`コレクションにユーザー情報を保存
    const userRef = doc(collection(db, 'users'), userid);
    await setDoc(userRef, { userid, password: hashedPassword });
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    res.status(200).json( {message: 'User registered successfully!', user: userData });
    } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
    }
} else {
    res.status(405).json({ message: 'Method not allowed' });
}
}
