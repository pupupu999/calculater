import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';
import { db } from '../frontend/poker-app/src/pages/firebase.js';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import path from 'path';
import { fileURLToPath } from 'url';
import auth from './auth.js';

let rooms = {}; // 各ルームIDにパスワードを保持

// __dirname の代替コード
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express アプリケーションを作成
const app = express();

//ミドルウェアの設定
app.use(express.json());

// ルーティングの設定
app.use('/api/auth', auth);


// 静的ファイルの配信設定
app.use(express.static(path.join(__dirname, '../frontend/poker-app/build')));

// React のエントリポイントを配信
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/poker-app/build', 'index.html'));
});

// HTTP サーバーを作成
const server = createServer(app);

// Socket.IO サーバーを初期化
const io = new Server(server);

// Socket.IO のイベントハンドラ
io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    socket.onAny((event, ...args) => {
        console.log(`受信イベント: ${event}`, args);
    });

    socket.on('join_room', async ({ roomId, username, password }, callback) => {
        if (rooms[roomId]) {
            if (rooms[roomId].password === password) {
                if (!rooms[roomId].users) {
                    rooms[roomId].users = [];
                }
                if (rooms[roomId].users.length < rooms[roomId].capacity) {
                    rooms[roomId].users.push({ socketId: socket.id, username, message: '' });
                    socket.join(roomId);
                    io.to(roomId).emit('user_connected', { userInfo: rooms[roomId].users, total: rooms[roomId].total });
                    callback({ success: true });
                } else {
                    callback({ success: false, message: '定員に達しています' });
                }
            } else {
                callback({ success: false, message: 'パスワードが違います' });
            }
        } else {
            callback({ success: false, message: '部屋が見つかりません' });
        }
    });

    socket.on('create_room', ({ roomId, username, roomStack, roomMember, password }) => {
        rooms[roomId] = { password, stack: roomStack, capacity: Number(roomMember), users: [{ socketId: socket.id, username, message: '' }], total: 0 };
        socket.join(roomId);
        console.log(`Room ${roomId} created`);
    });

    socket.on('delete_room', ({ roomId }) => {
        if (rooms[roomId]) {
            //部屋の情報を削除
            delete rooms[roomId]
            //部屋に参加していたユーザーを退室させる
            io.to(roomId).emit('room_deleted');
            io.in(roomId).socketsLeave(roomId);
            console.log(`Room ${roomId} deleted`);
        }
    });
    //自身の残りスタックを送信する
    socket.on('message', ({ roomId, username, message }) => {
        rooms[roomId].total = 0;
        rooms[roomId].users.forEach((user) => {
            if (user.username === username) {
                user.message = (Number(message) - rooms[roomId].stack);
                message = user.message;
            }
            rooms[roomId].total += Number(user.message);
        });
        io.to(roomId).emit('receive_message', { username, message, total: rooms[roomId].total });
    });
    //部屋の退室を実行する
    socket.on('leave_room', ({ roomId, username }) => {
        if (rooms[roomId]) {
            rooms[roomId].users = rooms[roomId].users.filter((user) => user.username !== username);
            io.to(roomId).emit('user_connected', rooms[roomId].users);
            socket.leave(roomId);
        }
    });

    socket.on('save_score', async ({ users }) => {
        try {
            const newMember = users.map(user => user.username);
            users.forEach(async (user) => {
                const currentDate = Timestamp.now();
                const docRef = doc(db, 'users', user.username);
                const docSnap = await getDoc(docRef);
                //cloud firestoreにデータを保存する
                if (docSnap.exists()&&docSnap.data().results) {
                    //今までの記録がある場合、データを更新する
                    const prevData = docSnap.data().results.day_value;
                    const newTotal = prevData[prevData.length - 1].total_chip + Number(user.message);
                    const newData = [...prevData, { date: currentDate, chip: user.message, total_chip: newTotal ,member: newMember}];
                    const prevScore = docSnap.data().results.count.games;
                    const prevWins = docSnap.data().results.count.wins;
                    const prevLosses = docSnap.data().results.count.losses;
                    const newScore = prevScore + 1;
                    const newWins = Number(user.message) < 0 ? prevWins : prevWins + 1;
                    const newLosses = Number(user.message) < 0 ? prevLosses + 1 : prevLosses;
                    //更新したデータを記録する
                    await setDoc(docRef, {
                        results: {
                            day_value: newData,
                            count: { games: newScore, wins: newWins, losses: newLosses }
                        }
                    }, { merge: true });
                } else if(docSnap.exists()){
                    //一回目の記録の場合、そのままその回の記録を保存する
                    const newTotal = Number(user.message);
                    const newData = [{ date: currentDate, chip: user.message, total_chip: newTotal, member: newMember }];
                    const newScore = 1;
                    const newWins = Number(user.message) < 0 ? 0 : 1;
                    const newLosses = Number(user.message) < 0 ? 1 : 0;
                    await setDoc(docRef, {
                        results: {
                            day_value: newData,
                            count: { games: newScore, wins: newWins, losses: newLosses }
                        }
                    }, { merge: true });
                } else {
                    console.log("ユーザー情報が見つかりません!");
                }
            });
        } catch (error) {
            console.error("スコア保存中にエラーが発生しました！", error);
        }
    });

    socket.on('disconnect', () => {
        for (const roomId in rooms) {
            if (rooms[roomId].users) {
                rooms[roomId].users = rooms[roomId].users.filter((user) => user.socketId !== socket.id);
                io.to(roomId).emit('room_users', rooms[roomId]);
            }
        }
        console.log('User disconnected', socket.id);
    });
});

// サーバーを指定ポートで起動
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});