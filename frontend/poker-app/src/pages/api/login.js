// pages/api/login.js
import { db } from '../firebase';
import { collection, doc, getDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
const { userid, password } = req.body;

if (req.method === 'POST') {
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
        res.status(200).json({ message: 'Login successful!', user: userData });
    } else {
        res.status(401).json({ message: 'Invalid password' });
    }
    } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
    }
} else {
    res.status(405).json({ message: 'Method not allowed' });
}
}
