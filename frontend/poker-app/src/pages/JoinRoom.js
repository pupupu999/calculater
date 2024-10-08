import Header from "@/components/Header";
import styles from "@/styles/style.module.css";
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/pages/firebase";

let socket;

export default function JoinRoom() {
    const [roomId, setRoomId] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [receivedMessage, setReceivedMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [joined, setJoined] = useState(false);

    useEffect(() => {
        const userid = sessionStorage.getItem('userid');
        const cleanedUserid = userid.trim().replace(/['"]+/g, '');
        console.log('こんにちは！');
        if(cleanedUserid) {
            const fetchUserInfo = async () => {
                try {
                    const docRef = doc(db, 'users', cleanedUserid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUsername(docSnap.data().userid);
                        setUsers([{username: docSnap.data().userid, message: []}]);
                    } else {
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

        socket.on('receive_message', ({username, message}) => {
            setUsers((prevUsers) => {
                const updateUsers = prevUsers.map((user) => {
                    if (user.username === username) {
                        return { ...user, message: [...user.message, message]};
                    }
                    return user;
                });
                return updateUsers;
            });
        });

        //新しいユーザーが接続したときの処理
        socket.on('user_connected', (user) => {
            setUsers((prevUsers) => [...prevUsers, {username: user.username, message: []}]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const joinRoom = () => {
        socket.emit('join_room', { roomId, username, password }, (response) => {
            if (response.success) {
                alert('Room joined!');
                setJoined(true);
            } else {
                alert(response.message);
            }
        });
    };

    const sendMessage = () => {
        socket.emit('message', { roomId, username, message });
        setMessage('');
    }

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
                <input
                    type="text"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send Message</button>
                <div>
                    {users.map((user, index) => (
                        <div key={index}>
                            <h3>{user.userid}のメッセージ</h3>
                            <p>{user.message}</p>
                        </div>
                    ))}
                </div>
            </div>
            )}
        </div>
    );
}