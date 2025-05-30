import styles from "../styles/style.module.css";
import React, { useState } from 'react';
import Spinner from "../components/Spinner.js";
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../firebase.js';
import { syncUserToServer } from "../utils/syncUser.js";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'react-feather';

const Login = () =>  {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleNavigation=(path) => {
        navigate(path);
    }

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await syncUserToServer(result.user);
            alert('Googleログイン成功');
            navigate('/Mypage');
        } catch (err) {
            console.error(err);
            alert('Googleログイン失敗');
        } finally {
            setLoading(false);
        }
    };
    
    const handleloginWithEmail = async () => {
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            await syncUserToServer(result.user);
            alert("ログイン成功:", result.user);
            navigate('/Mypage');
        } catch (error) {
            alert("ログインに失敗しました");
        } finally {
            setLoading(false);
        }
    };

    if(loading){
        return <Spinner />;
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <button className={styles.backButton} onClick={() => handleNavigation('/')}>
                    <ArrowLeft size={18} style={{ marginRight: '8px' }} />
                    戻る
                </button>
                <h2 className={styles.loginTitle}>Login</h2>
                <div className={styles.loginContent}>
                    <div className={styles.loginLeft}>
                        <input
                            className={styles.loginInput}
                            type="email"
                            placeholder="メールアドレス"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className={styles.loginInput}
                            type="password"
                            placeholder="パスワード"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className={styles.emailLoginButton} onClick={handleloginWithEmail}>
                            ログイン
                        </button>
                    </div>
                    <div className={styles.loginRight}>
                    <div className={styles.forgotPassword}>または</div>
                        <button className={styles.socialLoginButton} onClick={() => handleNavigation('/Register')}>メールアドレスで新規登録</button>
                        <button className={styles.socialLoginButton} onClick={handleGoogleLogin}>
                            Googleでサインイン
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
