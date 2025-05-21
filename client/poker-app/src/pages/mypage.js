import React, { useState } from 'react';
import styles from '../styles/style.module.css';
import Header from "../components/Header.js";
import Record from "../components/BattleRecord.js";
import Spinner from "../components/Spinner.js"
import Card from "../components/Card.js";
import CreateRoomButton from "../components/CreateRoomButton.js";
import SearchRoomButton from "../components/SearchRoomButton.js";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../hooks/useUser.js";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js"; 

const MyPage = () => {
    const navigate = useNavigate();
    const { user, loading, isLoggedIn } = useUser();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUsername, setNewUsername] = useState(user ? user.username : '');

    const handleUsernameClick = () => {
        if (isLoggedIn) {
            setIsModalOpen(true);
        }
    };

    const handleUsernameChange = (e) => {
        setNewUsername(e.target.value);
    };

    const handleUsernameSubmit = async () => {
        try {
            const userRef = doc(db, "users", user.uid); // UID を使ってドキュメント参照を取得
            await updateDoc(userRef, {
                displayName: newUsername
            });
            setIsModalOpen(false);

            // ユーザー情報を再取得して画面に反映させる
            window.location.reload(); // 簡易的な再取得手段
        } catch (error) {
            console.error("ユーザー名の更新に失敗しました:", error);
        }
    };

    const handleNavigation = (path) => {
        if(isLoggedIn) {
            navigate(path);
        } else {
            navigate('/login');
        }
    }
    //処理中に画面を描画しないようにする
    if(loading){
        return <Spinner />;
    }

    if(!user) return <p>ユーザー情報が取得できませんでした</p>

    return (
        <div className={styles.background}>
            <Header />
            <span className={styles.username} onClick={handleUsernameClick} style={{ cursor: 'pointer' }}>
                {isLoggedIn ? user.username : "Guest"}
            </span>
            <hr className={styles.line}/>
            <div className={styles.main}>
                <div className={styles.title}>
                    <div className={styles.kurupin}>
                        <Card currentChip={(!isLoggedIn||(!user.data||user.data.length==0)) ? 0 : user.data[user.data.length-1].total_chip}/>
                    </div>
                    <div className={styles.button_row}>
                        <div className={styles.image_container_topcenter}>
                            <CreateRoomButton onClick={() => handleNavigation('/CreateRoom')} />
                        </div>
                        <div className={styles.image_container_topcenter}>
                            <SearchRoomButton onClick={() => handleNavigation('/JoinRoom')} />
                        </div>
                    </div>
                </div>
                <div className = {styles.record}>
                    <Record login = {isLoggedIn}/>
                </div>
            </div>
            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalClose} onClick={() => setIsModalOpen(false)}>×</div>
                        <div className={styles.modalTitle}>RENAME</div>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={handleUsernameChange}
                            className={styles.modalInput}
                            placeholder="新しいユーザーネームを入力して下さい"
                        />
                        <button onClick={handleUsernameSubmit} className={styles.modalButton}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPage;