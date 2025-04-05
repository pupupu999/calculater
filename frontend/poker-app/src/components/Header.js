import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 
import styles from '../styles/style.module.css'; 
const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleNavigation = (path) => {
        setMenuOpen(false); 
        navigate(path);
    };

    const navigation=()=>{
        navigate('/mypage');
    }

    const logout = () => {
        sessionStorage.removeItem('userid');
        sessionStorage.removeItem('login');
        navigate('/');
    }

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                    <img src='/img/kurupin.png' alt='logo' className={styles.logo} onClick={() => navigation()}/>
            </div>
            <nav className={`${styles.nav} ${menuOpen ? styles.active : ''}`}>
                <ul>
                    <li><a onClick= {() => handleNavigation('/mypage')}>Home</a></li>
                    <li><a onClick= {() => handleNavigation('/CreateRoom')}>部屋作成</a></li>
                    <li><a onClick= {() => handleNavigation('/JoinRoom')}>部屋検索</a></li>
                    <li><a onClick= {() => handleNavigation('/Ranking')}>ランキング</a></li>
                    <li><a onClick= {() => logout()}>ログアウト</a></li>
                </ul>
            </nav>
            <div className={styles.hamburger} onClick={toggleMenu}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </div>
        </header>
    );
};

export default Header;
