import Header from "@/components/Header";
import styles from "@/styles/style.module.css";
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;

export default function CreateRoom() {
    const [roomId, setRoomId] = useState('');
    const [password, setPassword] = useState('');
    const [roomStack, setRoomStack] = useState('');
    const [roomMember, setRoomMember] = useState('');
    const [message, setMessage] = useState('');
    const [receivedMessage, setReceivedMessage] = useState('');
    const [joined, setJoined] = useState(false);

    useEffect(() => {
        socket = io();

        socket.on('receive_message', (data) => {
        setReceivedMessage(data.message);
    });

    return () => {
        socket.disconnect();
    };
    }, []);

    const createRoom = () => {
        socket.emit('create_room', { roomId, roomStack, roomMember, password });
        setJoined(true);
    };

    const deleteRoom = () => {
        socket.emit('delete_room', { roomId });
        setJoined(false);
    };

    const sendMessage = () => {
        socket.emit('message', { roomId, message });
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
                <input
                    type="text"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send Message</button>
                <p>Received Message: {receivedMessage}</p>
                <button onClick={deleteRoom}>Delete Room</button>
            </div>
            )}
        </div>
        </div>
    );
}

