import styles from "@/styles/style.module.css";
import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { useRouter } from "next/router";

export default function Login() {
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const [logined, setLogined] = useState(false);

    const router = useRouter();

    const handleNavigation = (path) => {
        router.push(path);
    }

    const handleGoogleLogin = async () => {
        try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log("Logged in as:", user.displayName);
        setLogined(true);
        // ログイン成功後の処理
        } catch (error) {
        console.error("Error during Google login:", error);
        alert("Googleログインに失敗しました");
        }
    };

    const registerUser = async () => {
        try {
            if (!userid || !password) {
                alert('ユーザーIDとパスワードを入力してください');
                return;
            }
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userid, password })
            });
            const data = await response.json();
            alert(data.message);
            sessionStorage.setItem('userid', JSON.stringify(data.user.userid));
            sessionStorage.setItem('login', JSON.stringify(true));
            handleNavigation('/mypage');
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    const loginUser = async () => {
        try {
            if (!userid || !password) {
                alert('ユーザーIDとパスワードを入力してください');
                return;
            }
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userid, password })
            });
            const data = await response.json();
            if (data.message === 'Login successful!') {
                alert('ログイン成功');
                sessionStorage.setItem('userid', JSON.stringify(data.user.userid));
                sessionStorage.setItem('login', JSON.stringify(true));
                setLogined(true);
                handleNavigation('/mypage');
            } else {
                alert(data.message);
            }
        } catch (error) {
        console.error('Error logging in:', error);
        alert('ログインに失敗しました');
        }
    };

return (
    <div>
        <div className = {styles.background}>
            <h1>Login</h1>
            <button onClick={handleGoogleLogin}>Login with Google</button>
            <input 
                type="text"
                placeholder="userid"
                value={userid}
                onChange={(e) => setUserid(e.target.value)}
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={registerUser}>Create Account</button>
            <button onClick={loginUser}>Login</button>
        </div>
    </div>
);
}
