import styles from "@/styles/style.module.css";
import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export default function Login() {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [logined, setLogined] = useState(false);

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

  return (
    <div className={styles.background}>
      <div>
        <h1>Login</h1>
        {!logined ? (
          <button onClick={handleGoogleLogin}>Login with Google</button>
        ) : (
          <h2>Welcome, you are logged in!</h2>
        )}
      </div>
    </div>
  );
}
