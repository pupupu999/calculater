import Header from "../components/Header.js";
import Spinner from "../components/Spinner.js";
import styles from "../styles/style.module.css";
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from "../hooks/useUser.js";

export default function RoomPage() {
    const { roomId } = useParams();
    const { user, isLoggedIn, loading } = useUser();
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [message, setMessage] = useState('');
    const [isHost, setIsHost] = useState(false);
    const [fixedResult, setFixedResult] = useState(false);

    useEffect(() => {
        if (loading) return;

        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        const socket = io(
            window.location.hostname.includes('localhost')
                ? 'http://localhost:3001'
                : 'https://chipin-fdzx.onrender.com',
            {
                transports: ['websocket'],
                withCredentials: true,
            }
        );
        socketRef.current = socket;

        // サーバーに参加通知
        socket.emit('join_room', {
            roomId,
            username: user.username,
            uid: user.uid
        });

        // 初期情報受信
        socket.on('room_info', ({ users, hostUid, total }) => {
            setUsers(users);
            setIsHost(hostUid === user.uid);
            setTotal(total);
        });

        socket.on('receive_message', ({ username, message, total }) => {
            setUsers(prev => prev.map(u =>
                u.username === username ? { ...u, message } : u
            ));
            setTotal(total);
        });

        socket.on('user_connected', ({ userInfo, total }) => {
            setUsers(userInfo);
            setTotal(total);
        });

        socket.on('user_left', ({ userInfo, total }) => {
            setUsers(userInfo);
            setTotal(total);
        });

        socket.on('room_deleted', () => {
            alert('部屋が削除されました');
            navigate('/mypage');
        });

        return () => {
            socket.disconnect();
        };
    }, [loading, isLoggedIn, user, roomId]);

    const sendMessage = () => {
        if (!socketRef.current) return;
        socketRef.current.emit('message', {
            roomId,
            username: user.username,
            message
        });
        console.log('メッセージ送信');
        setMessage('');
    };

    const leaveRoom = () => {
        if(!socketRef.current) return;
        socketRef.current.emit('leave_room', { roomId, username: user.username });
        navigate('/mypage');
    }

    const deleteRoom = () => {
        if (!socketRef.current) return;
        socketRef.current.emit('delete_room', { roomId });
        navigate('/mypage');
    };

    const recordData = () => {
        if (users.some(u => u.message === '' || u.message == null)) {
            alert('全員のスタックが入力されていません');
            return;
        }

        if (total !== 0) {
            alert('Totalが0になっていません！');
            return;
        }

        if (fixedResult) {
            alert('すでに結果は保存されています');
            return;
        }

        socketRef.current.emit('save_score', { users });
        setFixedResult(true);
        alert('結果が保存されました');
    };

    if (loading) return <Spinner />;

    return (
        <div className={styles.background}>
            <Header />
            <div className={styles.settlementContainer}>
                <h2 className={styles.roomIdTitle}>ROOM ID: {roomId}</h2>
                <hr className={styles.line} />
                <div className={styles.settlementContent}>
                    <div className={styles.inputSection}>
                        <h3>{user.username}：入力フォーム</h3>
                        <div className={styles.inputRow}>
                            <input
                                type="number"
                                className={styles.roomInput}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="スタックを入力"
                            />
                            <button className={styles.roomButton} onClick={sendMessage}>送信</button>
                        </div>
                    </div>
                    <div className={styles.resultSection}>
                        <h3>Total</h3>
                        <div className={styles.totalCard}>{total}</div>
                        {users.map((u, i) => (
                            <div key={i} className={styles.userResultCard}>
                                <div className={styles.userLabel}>{u.username}</div>
                                <div className={styles.userScore}>{u.message || 0}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.roomButton_row}>
                    {isHost ? (
                        <>
                            <button className={styles.deleteButton} onClick={deleteRoom}>部屋を削除</button>
                            <button className={styles.confirmButton} onClick={recordData}>確定</button>
                        </>
                    ) : (
                        <button className={styles.deleteButton} onClick={leaveRoom}>退室する</button>
                    )}
                </div>
            </div>
        </div>
    );
}