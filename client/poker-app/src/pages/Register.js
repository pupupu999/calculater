import React, { useState } from 'react';
import Spinner from '../components/Spinner.js';
import { auth } from '../firebase.js';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { syncUserToServer } from '../utils/syncUser.js';
import styles from '../styles/style.module.css';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';

export default function Register() {
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);

const navigate=useNavigate();

const handleRegister = async () => {
    setLoading(true);
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, {displayName: username});
        await syncUserToServer(result.user);
        alert('登録完了しました');
        navigate('/Mypage');
    } catch (err) {
        if(err.code === 'auth/email-already-in-use'){
            alert('このメールアドレスはすでに使われています');
        }else{
            console.error(err);
            alert('登録に失敗しました');
        }
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
            <button className={styles.backButton} onClick={() => navigate('/Login')}>
                <ArrowLeft size={18} style={{ marginRight: '8px' }} />
                ログインに戻る
            </button>
            <h2 className={styles.loginTitle}>新規登録</h2>
            <div className={styles.loginContent}>
                <div className={styles.loginLeft}>
                    <input
                        className={styles.loginInput}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="ユーザー名"
                    />
                    <input
                        className={styles.loginInput}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="メールアドレス"
                    />
                    <input
                        className={styles.loginInput}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="パスワード"
                        type="password"
                    />
                    <button className={styles.emailLoginButton} onClick={handleRegister}>
                        登録
                    </button>
                </div>
            </div>
        </div>  
    </div>
);
}