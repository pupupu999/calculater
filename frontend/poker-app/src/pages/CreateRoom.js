import Header from "../components/Header.js";
import Spinner from "../components/Spinner.js";
import styles from "../styles/style.module.css";
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../hooks/useUser.js";

export default function CreateRoom() {
    const [roomId, setRoomId] = useState('');
    const [password, setPassword] = useState('');
    const [roomStack, setRoomStack] = useState('');
    const [roomMember, setRoomMember] = useState('');
    const [message, setMessage] = useState('');
    const [joined, setJoined] = useState(false);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const { user, isLoggedIn, loading } = useUser();
    const[users, setUsers] = useState([]);

    const socketRef=useRef(null);

    useEffect(() => {
        //ローディング中に処理を進めないようにする
        if(loading) return;

        if(!isLoggedIn){
            navigate('/login');
            return;
        }

        if (user) {
            setUsers([{ username: user.username, message: '' ,uid: user.uid}]);
        }

        const newSocket = io(`${window.location.hostname}:3001`, {
            transports: ["websocket"],
            withCredentials: true
        });

        socketRef.current=newSocket;

        newSocket.on('receive_message', ({username, message, total}) => {
            setUsers((prevUsers) => {
                const updateUsers = prevUsers.map((user) => {
                    if (user.username === username) {
                        return { ...user, message: message};
                    }
                    return user;
                });
                console.log('スタックの送信確認:',updateUsers);
                return updateUsers;
            });
            setTotal(total);
        });

        //新しいユーザーが接続したときの処理
        newSocket.on('user_connected', ({userInfo, total}) => {
            setUsers(userInfo);
            setTotal(total);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [loading, isLoggedIn, user]);

    const createRoom = () => {
        if(socketRef.current){
            socketRef.current.emit('create_room', { roomId, username: user.username, roomStack, roomMember, password, uid:user.uid });
            setJoined(true);
        }else{
            console.error('Socket is not initialized.');
        }
    };

    const deleteRoom = () => {
        if(socketRef.current){
            socketRef.current.emit('delete_room', { roomId });
            setJoined(false);
        }else{
            console.error('Socket is not initialized.');
        }
    };

    const sendMessage = () => {
        if(socketRef.current){
            socketRef.current.emit('message', { roomId, username: user.username, message });
            setMessage('');
        }else{
            console.error('Socket is not initialized.');
        }
    };

    const recordData = () => {
        if(socketRef.current){
            console.log('Emitting save_score with users:', users);
            socketRef.current.emit('save_score', { users });
        }else{
            console.error('Socket is not initialized.');
        }
    }

    if(loading) return <Spinner />;

    return (
        <div className={styles.background}>
        <Header />
        <div className={styles.body}>
            {!joined ? (
            <div>
                <div className={styles.textbox}>
                    <input
                        className={styles.input} 
                        type="text"
                        placeholder="ルームID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                    <input
                        className={styles.input} 
                        type="number"
                        placeholder="スタック"
                        value={roomStack}
                        onChange={(e) => setRoomStack(e.target.value)}
                    />
                    <input
                        className={styles.input} 
                        type="number"
                        placeholder="人数"
                        value={roomMember}
                        onChange={(e) => setRoomMember(e.target.value)}
                    />
                    <input
                        className={styles.input} 
                        type="password"
                        placeholder="パスワード"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className={styles.button} onClick={createRoom}>ルーム作成</button>
                </div>
            </div>
            ) : (
            <div>
                <h2>ROOM ID:{roomId}</h2>
                <h3>Total</h3>
                <p>{total}</p>
                <input className={styles.roomInput}
                    type="number"
                    placeholder="残りスタックを入力してください"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className={styles.roomButton} onClick={sendMessage}>送信する</button>
                <div className={styles.resultsList}>
                    {users.map((user, index) => (
                        <div key={index} className={styles.userItem}>
                            <h3>{user.username}のスタック</h3>
                            <p>{user.message}</p>
                        </div>
                    ))}
                </div>
                <button className={styles.roomButton} onClick={recordData} >確定</button>
                <button className={styles.roomButton} onClick={deleteRoom}>Delete Room</button>
            </div>
            )}
        </div>
        </div>
    );
}

