import React, { useState } from 'react';
import { auth } from '../firebase.js';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { syncUserToServer } from '../utils/syncUser.js';
import styles from '../styles/style.module.css';
import { useNavigate } from 'react-router-dom';

export default function Register() {
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const navigate=useNavigate();

const handleRegister = async () => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, {displayName: username});
        await syncUserToServer(result.user);
        alert('登録成功');
        navigate('/Mypage');
    } catch (err) {
        if(err.code === 'auth/email-already-in-use'){
            alert('このメールアドレスはすでに使われています');
        }else{
            console.error(err);
            alert('登録失敗');
        }
    }
};

return (
    <div>
        <div className={styles.background}>
            <h2>メールで登録</h2>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder='Username'></input>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
            <button onClick={handleRegister}>登録</button>
        </div>
    </div>
);
}