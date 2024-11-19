import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/router'; 
import styles from '@/styles/style.module.css'; 
const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleNavigation = (path) => {
        setMenuOpen(false); 
        router.push(path); 
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <h1>My Logo</h1>
            </div>
            <nav className={`${styles.nav} ${menuOpen ? styles.active : ''}`}>
                <ul>
                    <li><a onClick= {() => handleNavigation('/')}>Home</a></li>
                    <li><a onClick= {() => handleNavigation('/CreateRoom')}>部屋作成</a></li>
                    <li><a onClick= {() => handleNavigation('/JoinRoom')}>部屋検索</a></li>
                    <li><a onClick= {() => handleNavigation('/BattleRecord')}>戦績画面</a></li>
                </ul>
            </nav>
            <div className={styles.hamburger} onClick={toggleMenu}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </div>
        </header>
    );
};

export default Header;
