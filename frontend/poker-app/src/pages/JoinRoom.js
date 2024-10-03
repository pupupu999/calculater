import styles from "@/styles/style.module.css";
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function JoinRoom() {
    const joinRoom = () => {
        socket.emit('join_room', { roomId, password }, (response) => {
          if (response.success) {
            setJoined(true);
          } else {
            alert(response.message);
          }
        });
    };

    return(
        <div className={styles.background}>
            <div className={styles.header}>
                <h1>ルーム参加</h1>
            </div>
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
                    </div>
                    <button className={styles.button} onClick={joinRoom}>参加</button>
                </div>
            </div>
        </div>
    );
}