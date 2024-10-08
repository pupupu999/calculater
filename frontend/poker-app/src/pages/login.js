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
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userid, password })
        });
        const data = await response.json();
        alert(data.message);
        setLogined(true);
    } catch (error) {
        console.error('Error registering user:', error);
        alert('アカウント作成に失敗しました');
    }
};

const loginUser = async () => {
    try {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userid, password })
    });
    const data = await response.json();
    if (data.message === 'Login successful!') {
        alert('ログイン成功');
        sessionStorage.setItem('userid', JSON.stringify(data.user.userid));
        setLogined(true);
    } else {
        alert(data.message);
    }
    } catch (error) {
    console.error('Error logging in:', error);
    alert('ログインに失敗しました');
    }
};


    const goToCreateRoom = () => {
    // ルーム作成ページに遷移
    router.push("/CreateRoom");
    };

    const goToJoinRoom = () => {
    // ルーム参加ページに遷移
    router.push("/JoinRoom");
    };

return (
    <div className={styles.background}>
    <div>
        <h1>Login</h1>
        {!logined ? (
            <div className = {styles.background}>
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
        ) : (
            <>
                <h2>Welcome, you are logged in!</h2>
                <button onClick={goToCreateRoom}>Create Room</button>
                <button onClick={goToJoinRoom}>Join Room</button>
            </>
        )}
    </div>
    </div>
);
}
