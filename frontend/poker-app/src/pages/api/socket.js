import { Server } from "socket.io";

let rooms = {}; // 各ルームIDにパスワードを保持

export default function handler(req, res) {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', (socket) => {
            console.log('User connected', socket.id);

      // ユーザーが部屋に参加する処理
        socket.on('join_room', ({ roomId, password }, callback) => {
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
    }
    res.end();
}
