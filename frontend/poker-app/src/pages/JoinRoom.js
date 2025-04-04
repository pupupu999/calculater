import Header from "../components/Header.js";
import Spinner from "../components/Spinner.js";
import styles from "../styles/style.module.css";
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../hooks/useUser.js";

let socket;

export default function JoinRoom() {
    const [roomId, setRoomId] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [joined, setJoined] = useState(false);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    const {user, isLoggedIn, loading} = useUser();
    const [users, setUsers] = useState(user ? [{username: user.username, message: ''}]: []);


    useEffect(() => {
        //ローディング中は処理を進めないようにする
        if(loading) return;

        if(!isLoggedIn){
            navigate('/login');
            return;
        }

        socket = io();

        socket.on('receive_message', ({username, message, total}) => {
            setUsers((prevUsers) => {
                const updateUsers = prevUsers.map((user) => {
                    if (user.username === username) {
                        return { ...user, message: message};
                    }
                    return user;
                });
                return updateUsers;
            });

            setTotal(total);
        });

        //新しいユーザーが接続したときの処理
        socket.on('user_connected', ({userInfo, total}) => {
            console.log('つながったよ', userInfo);
            setUsers(userInfo);
            setTotal(total);
        });

        socket.on('room_deleted', () => {
            alert('部屋が削除されました');
            setJoined(false);
        });

        return () => {
            socket.disconnect();
        };
    }, [loading, isLoggedIn]);

    const joinRoom = () => {
        socket.emit('join_room', { roomId, username: user.username, password }, (response) => {
            if (response.success) {
                alert('Room joined!');
                setJoined(true);
            } else {
                alert(response.message);
            }
        });
    };

    const leaveRoom = () => {
        socket.emit('leave_room', { roomId, username: user.username });
        setJoined(false);
    }


    const sendMessage = () => {
        socket.emit('message', { roomId, username: user.username, message });
        setMessage('');
    }

    if(loading) return <Spinner />;

    return(
        <div className={styles.background}>
            <Header />
            {!joined ? (
            <div className={styles.body}>
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
                            type="text"
                            placeholder="パスワード"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className={styles.button} onClick={joinRoom}>参加</button>
                    </div>
                </div>
            </div>
            ) : (
            <div>
                <h2>ROOM ID:{roomId}</h2>
                <h3>Total</h3>
                <p>{total}</p>
                <input
                    type="number"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>送信する</button>
                <button onClick={leaveRoom}>退室する</button>
                <div>
                    {users.map((user, index) => (
                        <div key={index}>
                            <h3>{user.username}のメッセージ</h3>
                            <p>{user.message}</p>
                        </div>
                    ))}
                </div>
            </div>
            )}
        </div>
    );
}