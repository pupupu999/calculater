import styles from "@/styles/style.module.css";
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;

export default function Home() {
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

  const createRoom = () => {
    socket.emit('create_room', { roomId, password });
    setJoined(true);
  };

  const joinRoom = () => {
    socket.emit('join_room', { roomId, password }, (response) => {
      if (response.success) {
        setJoined(true);
      } else {
        alert(response.message);
      }
    });
  };

  const sendMessage = () => {
    socket.emit('message', { roomId, message });
    setMessage('');
  };

  return (
    <div>
      {!joined ? (
        <div>
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={createRoom}>Create Room</button>
          <button onClick={joinRoom}>Join Room</button>
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
