import styles from "../styles/style.module.css";
import React, { useState } from 'react';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../firebase.js';
import { syncUserToServer } from "../utils/syncUser.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate=useNavigate();

    const handleNavigationToRegister=() => {
        navigate('/Register');
    }

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await syncUserToServer(result.user);
            alert('Googleログイン成功');
            navigate('/Mypage');
        } catch (err) {
            console.error(err);
            alert('Googleログイン失敗');
        }
    };
    
    const handleloginWithEmail = async () => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            await syncUserToServer(result.user);
            alert("ログイン成功:", result.user);
            navigate('/Mypage');
        } catch (error) {
            alert("ログインに失敗しました");
        }
    };

return (
    <div>
        <div className = {styles.background}>
            <h1>Login</h1>
            <button onClick={handleGoogleLogin}>Googleでログイン</button>
            <input 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleNavigationToRegister}>新規登録</button>
            <button onClick={handleloginWithEmail}>メールアドレスでログイン</button>
        </div>
    </div>
);
}
