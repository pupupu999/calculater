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

        // すべてのイベントをログに記録(確認用)
        socket.onAny((event, ...args) => {
            console.log(`受信イベント: ${event}`, args);
        });

        // ユーザーが部屋に参加する処理
        socket.on('join_room', async ({ roomId, username, password }, callback) => {
            if (rooms[roomId]) {
                if (rooms[roomId].password === password) {
                    if(!rooms[roomId].users) {
                        rooms[roomId].users = [];
                    }
                    console.log('定員:', rooms[roomId].capacity);
                    console.log('現在の人数:', rooms[roomId].users.length);
                    console.log(rooms[roomId].users.length < rooms[roomId].capacity);
                    if (rooms[roomId].users.length < rooms[roomId].capacity) {
                        //ユーザー情報の追加
                        rooms[roomId].users.push({ socketId: socket.id, username, message: '' });
                        socket.join(roomId);
                        io.to(roomId).emit('user_connected',  ({userInfo: rooms[roomId].users, total: rooms[roomId].total}));
            
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

        // 部屋の作成処理
        socket.on('create_room', ({ roomId, username, roomStack, roomMember, password }) => {
            rooms[roomId] = { password: password, stack: roomStack, capacity: Number(roomMember), users: [{ socketId: socket.id, username, message: '' }], total: 0 };
            io.to(roomId).emit('user_connected', rooms[roomId].users);
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
        socket.on('message', ({roomId, username, message}) => {
            console.log('roomId:', roomId);
            console.log('確認なのだ', rooms[roomId].stack);
            rooms[roomId].total = 0;
            rooms[roomId].users.forEach((user) => {
                if (user.username === username) {
                    user.message = message;
                }
                console.log('確認なのだ', user);
                rooms[roomId].total = rooms[roomId].total + (user.message - rooms[roomId].stack);
            });
            io.to(roomId).emit('receive_message', {username, message, total: rooms[roomId].total});
        });

        // ユーザーが部屋から退出する処理
        socket.on('leave_room', ({ roomId, username }) => {
            if (rooms[roomId]) {
                rooms[roomId].users = rooms[roomId].users.filter((user) => user.username !== username);
                io.to(roomId).emit('user_connected', rooms[roomId].users);
                socket.leave(roomId);
            }
        });

        // ユーザーそれぞれのスコアを保存する処理
        socket.on('save_score', async ({ users }) => {
            console.log('とうろくかいし', users);
            try {
                users.forEach(async (user) => {
                    const currentDate = Timestamp.now();
                    const docRef = doc(db, 'users', user.username);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const prevData = docSnap.data().results.day_value;
                        const newData = [...prevData, { date: currentDate, chip: user.message }];
                        const prevTotal = docSnap.data().results.total_chips;
                        const newTotal = prevTotal + Number(user.message);
                        const prevScore = docSnap.data().results.count.games;
                        const prevWins = docSnap.data().results.count.wins;
                        const prevlosses = docSnap.data().results.count.losses;
                        const newScore = prevScore + 1;
                        if (Number(user.message) < 0) {
                            const newLosses = prevlosses + 1;
                            const newWins = prevWins;
                        } else {
                            const newWins = prevWins + 1;
                            const newLosses = prevlosses;
                        }
                        await setDoc(docRef, {
                            results: {
                                day_value: newData,
                                total_chips: newTotal,
                                count: {
                                    games: newScore,
                                    wins: newWins,
                                    losses: newLosses
                                }
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
            // 切断されたユーザーを各ルームから削除
            for (const roomId in rooms) {
                if (rooms[roomId].users) {
                    rooms[roomId].users = rooms[roomId].users.filter((user) => user.socketId !== socket.id);
        
                    // 更新されたユーザーリストを送信
                    io.to(roomId).emit('room_users', rooms[roomId]);
                }
            }
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
