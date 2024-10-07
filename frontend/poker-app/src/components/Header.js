import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from '@/styles/style.module.css'; 
const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    };

    return (
    <header className={styles.header}>
        <div className={styles.logo}>
            <h1>My Logo</h1>
        </div>
        <nav className={`${styles.nav} ${menuOpen ? styles.active : ''}`}>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
        <div className={styles.hamburger} onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
    </header>
    );
};

export default Header;
