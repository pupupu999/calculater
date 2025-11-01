import Header from "../components/Header.js";
import Spinner from "../components/Spinner.js";
import styles from "../styles/style.module.css";
import { ArrowLeft } from "react-feather";
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../hooks/useUser.js";

const JoinRoom = () => {
    const [roomId, setRoomId] = useState('');
    const [password, setPassword] = useState('');
    const [rebuy, setRebuy] = useState('');
    const pageName = "Join Room";

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

        // Socket.IO接続URLの決定
        const getSocketURL = () => {
            const hostname = window.location.hostname;
            
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
                return 'http://localhost:3001';
            }
            
            // ローカルネットワークIPアドレスの場合
            if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(hostname)) {
                return `http://${hostname}:3001`;
            }
            
            return 'https://chipin-fdzx.onrender.com';
        };

        const newSocket = io(getSocketURL(), {
            transports: ['websocket'],
            withCredentials: true,
        });
        
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
    
        if (!user) {
            alert('ユーザー情報が読み込まれていません。しばらく待ってから再度お試しください。');
            return;
        }
    
        if (!socketRef.current) {
            alert('接続が確立されていません。しばらく待ってから再度お試しください。');
            return;
        }
    
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
            <Header 
                pageName={pageName}
            />
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
                            type="password"
                            placeholder="パスワード"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            className={styles.roomInputField}
                            type="number"
                            placeholder="あなたのリバイ額"
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

export default JoinRoom;