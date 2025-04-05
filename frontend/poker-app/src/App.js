import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/index.js';
import Login from './pages/login.js';
import Mypage from './pages/mypage.js';
import CreateRoom from './pages/CreateRoom.js';
import JoinRoom from './pages/JoinRoom.js';
import Ranking from './pages/Ranking.js';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Mypage" element={<Mypage />} />
                <Route path="/createRoom" element={<CreateRoom />} />
                <Route path="/joinRoom" element={<JoinRoom />} />
                <Route path="/Ranking" element={<Ranking />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;