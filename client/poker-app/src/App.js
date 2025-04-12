import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/index.js';
import Login from './pages/login.js';
import Mypage from './pages/mypage.js';
import CreateRoom from './pages/CreateRoom.js';
import JoinRoom from './pages/JoinRoom.js';
import RoomPage from './pages/RoomPage.js';
import Ranking from './pages/Ranking.js';
import Register from './pages/Register.js';
import { AuthProvider } from './contexts/AuthContext.js';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/Mypage" element={<Mypage />} />
                    <Route path="/createRoom" element={<CreateRoom />} />
                    <Route path="/joinRoom" element={<JoinRoom />} />
                    <Route path="/Ranking" element={<Ranking />} />
                    <Route path="/Register" element={<Register />} />
                    <Route path="/room/:roomId" element={<RoomPage />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;