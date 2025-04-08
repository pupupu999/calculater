import React from 'react';
import styles from '../styles/style.module.css';
import Header from "../components/Header.js";
import Record from "../components/BattleRecord.js";
import Spinner from "../components/Spinner.js"
import Card from "../components/Card.js";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../hooks/useUser.js";

const MyPage = () => {
    const navigate = useNavigate();
    const { user, loading, isLoggedIn } = useUser();

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
            <span className={styles.username}>{isLoggedIn?user.username : "Guest"}</span>
            <hr className={styles.line}/>
            <div className={styles.main}>
                <div className={styles.title}>
                    <div className={styles.kurupin}>
                        <Card currentChip={(!isLoggedIn||(!user.data||user.data.length==0)) ? 0 : user.data[user.data.length-1].total_chip}/>
                    </div>
                    <div className={styles.button_row}>
                        <div className={styles.image_container_topcenter}>
                            <img src="/img/room_cre.png" alt="create room" onClick={() => handleNavigation('/CreateRoom')} />
                        </div>
                        <div className={styles.image_container_topcenter}>
                            <img src="/img/room_ser.png" alt="search room" onClick={() => handleNavigation('/JoinRoom')} />
                        </div>
                    </div>
                </div>
                <div className = {styles.record}>
                    <Record login = {isLoggedIn}/>
                </div>
            </div>
        </div>
    );
};

export default MyPage;