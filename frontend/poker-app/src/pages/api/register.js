// pages/api/register.js
import { db } from '../firebase'; // Firebase設定ファイルからdbをインポート
import { collection, setDoc, doc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
const { userid, password } = req.body;

if (req.method === 'POST') {
    try {
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // Firestoreの`users`コレクションにユーザー情報を保存
    const userRef = doc(collection(db, 'users'), userid);
    await setDoc(userRef, { userid, password: hashedPassword });

    res.status(200).json({ message: 'User registered successfully!' });
    } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
    }
} else {
    res.status(405).json({ message: 'Method not allowed' });
}
}
