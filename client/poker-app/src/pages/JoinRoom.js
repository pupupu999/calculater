import Header from "../components/Header.js";
import Spinner from "../components/Spinner.js";
import styles from "../styles/style.module.css";
import { ArrowLeft } from "react-feather";
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../hooks/useUser.js";

export default function JoinRoom() {
    const [roomId, setRoomId] = useState('');
    const [password, setPassword] = useState('');
    const [rebuy, setRebuy] = useState('');

    const navigate = useNavigate();

    const {user, isLoggedIn, loading} = useUser();
    
    const socketRef=useRef(null);

    useEffect(() => {
        //ローディング中は処理を進めないようにする
        if(loading) return;

        if(!isLoggedIn){
            navigate('/login');
            return;
        }

        const newSocket = io(
            window.location.hostname.includes('localhost')
                ? 'http://localhost:3001'
                : 'https://chipin-fdzx.onrender.com',
            {
                transports: ['websocket'],
                withCredentials: true,
            }
        );
        socketRef.current = newSocket;

        return () => {
            newSocket.disconnect();
        };
    }, [loading, isLoggedIn]);

    const joinRoom = () => {
        if (!roomId || !password) {
            alert('ルームIDとパスワードを入力してください');
            return;
        }
    
        if (!socketRef.current) return;
    
        socketRef.current.emit('join_room', {
            roomId,
            password,
            username: user.username,
            uid: user.uid,
            rebuy: Number(rebuy) || 0
        }, (response) => {
            if (response.success) {
                navigate(`/room/${roomId}`);
            } else {
                alert(response.message);
            }
        });
    };

    if(loading) return <Spinner />;

    return(
        <div className={styles.background}>
            <Header />
            <div className={styles.body}>
                <div className={styles.roomFormContainer}>
                    <div className={styles.roomInputBox}>
                        <button className={styles.backButton} onClick={() => navigate('/mypage')}>
                            <ArrowLeft size={18} style={{ marginRight: '8px' }} />
                            ホームに戻る
                        </button>
                        <h2 className={styles.roomFormTitle}>Room Search</h2>
                        <input
                            className={styles.roomInputField}
                            type="text"
                            placeholder="ルームID"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                        <input
                            className={styles.roomInputField}
                            type="text"
                            placeholder="パスワード"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            className={styles.roomInputField}
                            type="number"
                            placeholder="リバイ"
                            value={rebuy}
                            onChange={(e) => setRebuy(e.target.value)}
                        />
                        <button className={styles.roomCreateButton} onClick={joinRoom}>参加</button>
                    </div>
                </div>
            </div>
        </div>
    );
}