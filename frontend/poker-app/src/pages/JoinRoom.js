import styles from "@/styles/style.module.css";
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;

export default function JoinRoom() {
    const [roomId, setRoomId] = useState('');
    const [password, setPassword] = useState('');
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

    const joinRoom = () => {
        socket.emit('join_room', { roomId, password }, (response) => {
            if (response.success) {
                alert('Room joined!');
                setJoined(true);
            } else {
                alert(response.message);
            }
        });
    };

    const sendMessage = () => {
        socket.emit('message', { roomId, message });
        setMessage('');
    }

    return(
        <div className={styles.background}>
            <div className={styles.header}>
                <h1>ルーム参加</h1>
            </div>
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
                <p>Received Message: {receivedMessage}</p>
            </div>
            )}
        </div>
    );
}