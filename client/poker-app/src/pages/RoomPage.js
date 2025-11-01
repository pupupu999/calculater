import Spinner from "../components/Spinner.js";
import FriendModal from "../components/FriendModal.js";
import styles from "../styles/style.module.css";
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from "../hooks/useUser.js";
import { useAuth } from "../contexts/AuthContext.js";
import { baseURL } from "../utils/api.js";

const RoomPage = () => {
    const { roomId } = useParams();
    const { user, isLoggedIn, loading } = useUser();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const isHostRef = useRef(false);
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [message, setMessage] = useState('');
    const [isHost, setIsHost] = useState(false);
    const [fixedResult, setFixedResult] = useState(false);
    const [friends, setFriends] = useState([]);
    const [loadingFriends, setLoadingFriends] = useState(false);
    const [error, setError] = useState(null);
    const [isFriendModalOpen, setIsFriendModalOpen] = useState(false);

    useEffect(() => {
        if (loading) return;

        if (!isLoggedIn) {
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

        const socket = io(getSocketURL(), {
            transports: ['websocket'],
            withCredentials: true,
        });

        socketRef.current = socket;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                const navEntries = performance.getEntriesByType('navigation');
                const navType = navEntries.length > 0 ? navEntries[0].type : null;
                if (navType !== 'reload') {
                    if (isHostRef.current && socketRef.current) {
                        socketRef.current.emit('delete_room', { roomId });
                    }
                }
            }
        };

        document.addEventListener('unload', handleVisibilityChange);

        // サーバーに参加通知
        socket.emit('join_room', {
            roomId,
            username: user.username,
            uid: user.uid
        });

        // 初期情報受信
        socket.on('room_info', ({ users, hostUid, total }) => {
            setUsers(users);
            const isUserHost = hostUid === user.uid;
            setIsHost(isUserHost);
            isHostRef.current = isUserHost;
            setTotal(total);
        });

        socket.on('receive_message', ({ username, message, total }) => {
            setUsers(prev => prev.map(u =>
                u.username === username ? { ...u, message } : u
            ));
            setTotal(total);
        });

        socket.on('receive_proxy_message', ({ username, message, total, userInfo }) => {
            if (userInfo) {
                setUsers(userInfo);
            } else {
                setUsers(prev => prev.map(u =>
                    u.username === username ? { ...u, message } : u
                ));
            }
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
            if (isHostRef.current && socketRef.current) {
                socketRef.current.emit('delete_room', { roomId });
            }
            document.removeEventListener('unload', handleVisibilityChange);
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
            alert('全員の最終スタックが入力されていません');
            return;
        }

        if (total !== 0) {
            alert('Totalが0になっていません!');
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

    const fetchFriends = async () => {
        try {
            setLoadingFriends(true);
            setError(null);
            
            if (!currentUser) {
                throw new Error('ユーザーが認証されていません');
            }

            const idToken = await currentUser.getIdToken();
            const url = `${baseURL}/api/secure/friends`;
            
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });

            // レスポンスのContent-Typeを確認
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('JSONではないレスポンスを受信:', {
                    status: response.status,
                    statusText: response.statusText,
                    contentType: contentType,
                    body: text.substring(0, 500) // 最初の500文字のみ表示
                });
                throw new Error(`サーバーエラー: ${response.status} ${response.statusText}. HTMLが返されました。`);
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'フレンド情報の取得に失敗しました');
            }

            const data = await response.json();
            setFriends(data.friends || []);
        } catch (error) {
            setError(error);
        } finally {
            setLoadingFriends(false);
        }
    };

    const proxyRecord = () => {
        fetchFriends();
        setIsFriendModalOpen(true);
    };
    const closeFriendModal = () => setIsFriendModalOpen(false);

    const handleProxyInput = (friendUsername, inputValue, rebuy = 0, friendUid = null) => {
        if (!socketRef.current) return;
        if (!friendUsername || !inputValue) {
            alert('送信に必要な情報が不足しています');
            return;
        }
        if (rebuy < 0) {
            alert('リバイ額は0以上の値を入力してください');
            return;
        }
        socketRef.current.emit('proxy_message', {
            roomId,
            username: friendUsername,
            message: inputValue,
            rebuy: rebuy || 0,
            uid: friendUid
        }, (response) => {
            if (!response || !response.success) {
                alert(response?.message || '代理入力に失敗しました');
            }
        });
    };

    if (loading) return <Spinner />;

    return (
        <div className={styles.background}>
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
                                placeholder="最終スタックを入力"
                            />
                            <button className={styles.roomButton} onClick={sendMessage}>送信</button>
                        </div>
                    </div>
                    <div className={styles.resultSection}>
                        <h3>Total</h3>
                        <div className={styles.totalCard}>{total}</div>
                        {users.map((u, i) => (
                            <div key={i} className={styles.userResultCard}>
                                <div className={styles.userLabel}>
                                    {u.username}
                                    {u.isProxy && <span style={{ marginLeft: 8, color: '#888', fontSize: '0.9em' }}>(代理入力)</span>}
                                </div>
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
                        <>
                            <button className={styles.deleteButton} onClick={leaveRoom}>退室する</button>
                            <button className={styles.proxyButton} onClick={proxyRecord}>代理入力</button>
                        </>
                    )}
                </div>
            </div>
            <FriendModal 
                isOpen={isFriendModalOpen} 
                onClose={closeFriendModal} 
                isLoading={loadingFriends} 
                friends={friends}
                onProxySubmit={handleProxyInput}
            />
        </div>
    );
}

export default RoomPage;