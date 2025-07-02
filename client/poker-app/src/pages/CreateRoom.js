import Header from "../components/Header.js";
import Spinner from "../components/Spinner.js";
import styles from "../styles/style.module.css";
import { ArrowLeft } from "react-feather";
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../hooks/useUser.js";

const CreateRoom = () => {
    const [roomId, setRoomId] = useState('');
    const [password, setPassword] = useState('');
    const [roomStack, setRoomStack] = useState('');
    const [roomMember, setRoomMember] = useState('');
    const [rebuy, setRebuy] = useState('');
    const navigate = useNavigate();
    const pageName = "Create Room";

    const { user, isLoggedIn, loading } = useUser();

    const socketRef=useRef(null);

    useEffect(() => {
        //ローディング中に処理を進めないようにする
        if(loading) return;

        if(!isLoggedIn){
            navigate('/login');
            return;
        }

        //テスト環境
        // const newSocket = io(
        //     'http://192.168.0.50:3001',
        //     {
        //         transports: ['websocket'],
        //         withCredentials: true,
        //     }
        // );

        //↓本番環境
        const newSocket = io(
            window.location.hostname.includes('localhost')
                ? 'http://localhost:3001'
                : 'https://chipin-fdzx.onrender.com',
            {
                transports: ['websocket'],
                withCredentials: true
            }
        );

        socketRef.current=newSocket;

        return () => {
            newSocket.disconnect();
        };
    }, [loading, isLoggedIn]);

    const createRoom = () => {
        if (!roomId || !roomStack || !roomMember || !password) {
            alert('すべての項目を入力してください');
            return;
        }
    
        if (socketRef.current) {
            socketRef.current.emit('create_room', {
                roomId,
                username: user.username,
                roomStack,
                roomMember,
                password,
                uid: user.uid,
                rebuy: Number(rebuy) || 0
            }, (response) => {
                if (response.success) {
                    alert('部屋が作成できました');
                    navigate(`/room/${roomId}`);
                } else {
                    alert(response.message || '部屋の作成に失敗しました');
                }
            });
        } else {
            console.error('Socket is not initialized.');
        }
    };

    if(loading) return <Spinner />;

    return (
        <div className={styles.background}>
            <Header 
                pageName={pageName}
            />
            <div className={styles.roomFormContainer}>
                <div className={styles.roomInputBox}>
                    <button className={styles.backButton} onClick={() => navigate('/mypage')}>
                        <ArrowLeft size={18} style={{ marginRight: '8px' }} />
                        ホームに戻る
                    </button>
                    <h2 className={styles.roomFormTitle}>Room Setting</h2>

                    <input
                        className={styles.roomInputField}
                        type="text"
                        placeholder="ルームID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                    <input
                        className={styles.roomInputField}
                        type="number"
                        placeholder="スタック"
                        value={roomStack}
                        onChange={(e) => setRoomStack(e.target.value)}
                    />
                    <input
                        className={styles.roomInputField}
                        type="number"
                        placeholder="人数"
                        value={roomMember}
                        onChange={(e) => setRoomMember(e.target.value)}
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
                    <button className={styles.roomCreateButton} onClick={createRoom}>作成</button>
                </div>
            </div>
        </div>
    );
}

export default CreateRoom;

