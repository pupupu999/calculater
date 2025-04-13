import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';
import { db,admin } from './firebase-admin.js';
import path from 'path';
import { fileURLToPath } from 'url';
import auth from './routes/auth.js';
import secure from './routes/secure.js';
import helmet from 'helmet';
import cors from 'cors';

let rooms = {}; // 各ルームIDにパスワードを保持

// __dirname の代替コード
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express アプリケーションを作成
const app = express();

// 本番環境では変更する！（サーバーへのフロントのアクセス制限）
app.use(cors({
    origin:[
        "https://my-project-30c6b.web.app",
        "http://localhost:3000"
    ],
    credentials: true
}));

// app.use(
//     helmet({
//         crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
//         contentSecurityPolicy: {
//             directives: {
//                 defaultSrc: ["'self'"],
//                 imgSrc: ["'self'", "data:", "https://www.google.com"],
//                 scriptSrc: ["'self'", "https://apis.google.com"],
//                 connectSrc: [
//                     "'self'", 
//                     "https://apis.google.com",
//                     "https://identitytoolkit.googleapis.com",
//                     "https://firestore.googleapis.com",
//                 ],
//                 frameSrc: [
//                     "https://accounts.google.com",
//                     "https://my-project-30c6b.firebaseapp.com",
//                 ],
//                 styleSrc: ["'self'", "'unsafe-inline'"],
//             },
//         },
//     })
// );

app.use(
    helmet({
        crossOriginOpenerPolicy: false,
        contentSecurityPolicy: false
    })
);

//ミドルウェアの設定
app.use(express.json());

// ルーティングの設定
app.use('/api/auth', auth);
app.use('/api/secure', secure);

//開発用にだけ使う
if(process.env.NODE_ENV !== 'production') {
    // 静的ファイルの配信設定
    app.use(express.static(path.join(__dirname, '../client/poker-app/build')));
    // React のエントリポイントを配信
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/poker-app/build', 'index.html'));
    });
}

// HTTP サーバーを作成
const server = createServer(app);

// Socket.IO サーバーを初期化
const io = new Server(server, {
    cors: {
        origin: [
            "https://my-project-30c6b.web.app",
            "http://localhost:3000"
        ], 
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Socket.IO のイベントハンドラ
io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    socket.onAny((event, ...args) => {
        console.log(`受信イベント: ${event}`, args);
    });

    socket.on('join_room', ({ roomId, username, uid, password, rebuy }, callback) => {
        const room = rooms[roomId];
    
        if (!room) {
            return callback?.({ success: false, message: '部屋が存在しません' });
        }
    
        // JoinRoom.js 経由では password 必須
        if (password !== undefined) {
            if (room.password !== password) {
                return callback?.({ success: false, message: 'パスワードが違います' });
            }
        }
    
        // すでに参加済みの uid は再登録しない
        const alreadyJoined = room.users.some((u) => u.uid === uid);
        if (!alreadyJoined) {
            if (room.users.length >= room.capacity) {
                return callback?.({ success: false, message: '定員に達しています' });
            }
    
            room.users.push({ socketId: socket.id, username, message: '', uid, rebuy });
        }
    
        socket.join(roomId);
    
        // RoomPage 初期化用
        io.to(socket.id).emit('room_info', {
            users: room.users,
            hostUid: room.hostUid,
            total: room.total
        });
    
        io.to(roomId).emit('user_connected', {
            userInfo: room.users,
            total: room.total
        });
    
        callback?.({ success: true });
    });

    socket.on('create_room', ({ roomId, username, roomStack, roomMember, password, uid, rebuy }, callback) => {
        if (rooms[roomId]) {
            return callback?.({ success: false, message: '同じIDの部屋が既に存在します' });
        }
    
        rooms[roomId] = {
            password,
            stack: Number(roomStack),
            capacity: Number(roomMember),
            total: 0,
            hostUid: uid,
            users: [{ socketId: socket.id, username, message: '', uid, rebuy }]
        };
        socket.join(roomId);
        console.log(`Room ${roomId} created`);
        callback?.({ success: true });
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
        console.log("ユーザーメッセージ：",message);
        rooms[roomId].total = 0;
        rooms[roomId].users.forEach((user) => {
            if (user.username === username) {
                user.message = (Number(message) - (rooms[roomId].stack || 0) - (user.rebuy || 0));
                message = user.message;
            }
            rooms[roomId].total += Number(user.message);
        });
        io.to(roomId).emit('receive_message', { username, message, total: rooms[roomId].total });
    });
    //部屋の退室を実行する
    socket.on('leave_room', ({ roomId, username }) => {
        if (rooms[roomId]) {
            const leaveUser = rooms[roomId].users.filter((user) => user.username == username);
            rooms[roomId].users = rooms[roomId].users.filter((user) => user.username !== username);
            rooms[roomId].total -= Number(leaveUser[0].message);
            io.to(roomId).emit('user_left', {
                userInfo: rooms[roomId].users,
                total: rooms[roomId].total,
            });
            socket.leave(roomId);
        }
    });

    socket.on('save_score', async ({ users }) => {
        console.log("save_score 受信:", users);
        console.log("db type:", typeof db);
        console.log("db instanceof Firestore:", db instanceof admin.firestore.Firestore);
        try {
            const newMember = users.map(user => user.username);
            users.forEach(async (user) => {
                const currentDate = admin.firestore.Timestamp.now();
                const docRef = db.collection('users').doc(user.uid);
                const docSnap = await docRef.get();
    
                if (docSnap.exists && docSnap.data().results) {
                    const prevData = docSnap.data().results.day_value;
                    const newTotal = prevData[prevData.length - 1].total_chip + Number(user.message);
                    const newData = [...prevData, { date: currentDate, chip: user.message, total_chip: newTotal, member: newMember }];
                    const prevScore = docSnap.data().results.count.games;
                    const prevWins = docSnap.data().results.count.wins;
                    const prevLosses = docSnap.data().results.count.losses;
                    const newScore = prevScore + 1;
                    const newWins = Number(user.message) < 0 ? prevWins : prevWins + 1;
                    const newLosses = Number(user.message) < 0 ? prevLosses + 1 : prevLosses;
                    const prevFriends = docSnap.data().friends;
                    const newFriends = Array.from(new Set([...prevFriends, ...newMember]));
    
                    await docRef.set({
                        results: {
                            day_value: newData,
                            count: { games: newScore, wins: newWins, losses: newLosses }
                        },
                        friends: newFriends
                    }, { merge: true });
                } else if (docSnap.exists) {
                    const newTotal = Number(user.message);
                    const newData = [{ date: currentDate, chip: user.message, total_chip: newTotal, member: newMember }];
                    const newScore = 1;
                    const newWins = Number(user.message) < 0 ? 0 : 1;
                    const newLosses = Number(user.message) < 0 ? 1 : 0;
    
                    await docRef.set({
                        results: {
                            day_value: newData,
                            count: { games: newScore, wins: newWins, losses: newLosses }
                        },
                        friends: newMember
                    }, { merge: true });
                } else {
                    console.log("ユーザー情報が見つかりません!");
                }
            });
        } catch (error) {
            console.error("スコア保存中にエラーが発生しました！", error);
        }
    });
});

// サーバーを指定ポートで起動
const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0',() => {
    console.log(`Server is running on http://localhost:${PORT}`);
});