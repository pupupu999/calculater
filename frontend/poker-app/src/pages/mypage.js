import React, { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase.js";
import styles from '../styles/style.module.css';
import Header from "../components/Header.js";
import Record from "../components/BattleRecord.js";
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState([]);
    const [data, setData] = useState([]);
    const [scoreData, setScoreData] = useState([]);
    const [login, setLogin] = useState(false);

    useEffect(() => {
        const logined = sessionStorage.getItem('login');
        setLogin(logined);
        console.log("ログイン状態mae",logined);
        if(!login) {
            setUsername('Guest');
            return;
        }
        console.log("ログイン状態",login);
        console.log("ユーザーネーム確認",username);
        const userid = sessionStorage.getItem('userid');
        const cleanedUserid = userid.trim().replace(/['"]+/g, '');
        if(cleanedUserid) {
            const fetchUserInfo = async () => {
                try {
                    const docRef = doc(db, 'users', cleanedUserid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUsername(docSnap.data().userid);
                        setUsers([{username: docSnap.data().userid, message: ''}]);
                        setScoreData(docSnap.data().results.count);
                        const formattedData = docSnap.data().results.day_value.map((item) => ({
                            // タイムスタンプを日付に変換
                            ...item,
                            date: new Date(item.date.seconds * 1000).toLocaleDateString() // 'seconds'を使用して変換
                        }));
                            setData(formattedData);
                    } else {
                        console.log(docSnap.data());
                        console.log("ユーザー情報が見つかりません!");
                    }
                } catch (error) {
                    console.error("ユーザー情報取得中にエラーが発生しました！", error);
                }
            }

            fetchUserInfo();
        } else {
            console.log("ユーザー情報がありません。ログインしてください。");
            window.location.href = '/login';
        }
    }, [login]);

    const handleNavigation = (path) => {
        console.log("ログイン状態おおおおお",Boolean(login));
        if(Boolean(login)) {
            navigate(path);
        } else {
            navigate('/login');
        }
    }

    return (

        <div className={styles.background}>
            <Header />
            <span className={styles.username}>{username}</span>
            <hr className={styles.line}/>
            <div className={styles.main}>
                <div className={styles.title}>
                    <div className={styles.kurupin}>
                        <img src="/img/kurupin.png" alt="kurupin" />
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
                    <Record login = {login}/>
                </div>
            </div>
            <div className={styles.footer}></div>
        </div>
    );
};

export default MyPage;