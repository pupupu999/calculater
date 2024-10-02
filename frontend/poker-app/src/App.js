import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/index';
import Login from './pages/login';
import Mypage from './pages/mypage';
import CreateRoom from './pages/CreateRoom';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Mypage" element={<Mypage />} />
                <Route path="/createRoom" element={<CreateRoom />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;