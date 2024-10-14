import Header from "@/components/Header";
import styles from "@/styles/style.module.css";
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/pages/firebase";

let socket;

export default function CreateRoom() {
    const [roomId, setRoomId] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [roomStack, setRoomStack] = useState('');
    const [roomMember, setRoomMember] = useState('');
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [joined, setJoined] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
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
        socket = io();

        socket.on('receive_message', ({username, message, total}) => {
            setUsers((prevUsers) => {
                const updateUsers = prevUsers.map((user) => {
                    if (user.username === username) {
                        return { ...user, message: message};
                    }
                    return user;
                });
                console.log(updateUsers);
                return updateUsers;
            });
            setTotal(total);
            console.log(users);
        });

        //新しいユーザーが接続したときの処理
        socket.on('user_connected', ({userInfo, total}) => {
            console.log('user_connected', userInfo);
            setUsers(userInfo);
            setTotal(total);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const createRoom = () => {
        socket.emit('create_room', { roomId, username, roomStack, roomMember, password });
        setJoined(true);
    };

    const deleteRoom = () => {
        socket.emit('delete_room', { roomId });
        setJoined(false);
    };

    const sendMessage = () => {
        socket.emit('message', { roomId, username, message });
        setMessage('');
    };

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
                <input
                    type="number"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>送信する</button>
                <div>
                    {users.map((user, index) => (
                        <div key={index}>
                            <h3>{user.username}のメッセージ</h3>
                            <p>{user.message}</p>
                        </div>
                    ))}
                </div>
                <button onClick={deleteRoom}>Delete Room</button>
            </div>
            )}
        </div>
        </div>
    );
}

