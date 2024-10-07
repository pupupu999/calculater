// server.js

let rooms = {}; // 各ルームIDにパスワードを保持

const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        handle(req, res);
    });

    // Socket.IO サーバーを初期化
    const io = new Server(server);

    // Socket.IO のイベントハンドラ
    io.on('connection', (socket) => {
        console.log('User connected', socket.id);

        // ユーザーが部屋に参加する処理
        socket.on('join_room', async ({ roomId, password }, callback) => {
            if (rooms[roomId]) {
                if (rooms[roomId].password === password) {
                    socket.join(roomId);
                    callback({ success: true });
                } else {
                    callback({ success: false, message: 'Incorrect password' });
                } 
            } else {
                callback({ success: false, message: 'Room not found' });
            }
        });

        // 部屋の作成処理
        socket.on('create_room', ({ roomId, roomStack, roomMember, password }) => {
            rooms[roomId] = { password };
            socket.join(roomId);
            console.log(`Room ${roomId} created`);
        });

        // 部屋削除処理
        socket.on('delete_room', ({ roomId }) => {
            if (rooms[roomId]) {
                delete rooms[roomId]; // 部屋の情報を削除
                io.to(roomId).emit('room_deleted'); // 部屋の削除を通知
                io.in(roomId).socketsLeave(roomId); // 全ての参加者を部屋から退出させる
                console.log(`Room ${roomId} deleted`);
            }
        });

        // 他のユーザーが部屋にいることを確認するための処理
        socket.on('message', (data) => {
            io.to(data.roomId).emit('receive_message', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected', socket.id);
        });
    });

  // サーバーを指定ポートで起動
  const PORT = process.env.PORT || 3001;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
