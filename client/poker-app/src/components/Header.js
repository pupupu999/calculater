import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 
import { auth } from '../firebase.js'
import styles from '../styles/style.module.css'; 
const Header = ({ pageName }) => {
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

    const logout = async () => {
        try{
            await auth.signOut();
            navigate('/');
        }catch(error){
            console.error("ログアウトに失敗しました:",error);
        }
    }

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                    <img src='/img/kurupin.png' alt='logo' className={styles.logo} onClick={() => navigation()}/>
            </div>
            <div className={`${styles.pageName} ${menuOpen ? styles.active : ''}`}>
                {pageName}
            </div>
            <nav className={`${styles.nav} ${menuOpen ? styles.active : ''}`}>
                <ul>
                    <li><a onClick= {() => handleNavigation('/mypage')}>Home</a></li>
                    <li><a onClick= {() => handleNavigation('/CreateRoom')}>Create Room</a></li>
                    <li><a onClick= {() => handleNavigation('/JoinRoom')}>Search Room</a></li>
                    <li><a onClick= {() => handleNavigation('/Ranking')}>Ranking</a></li>
                    <li><a onClick= {() => logout()}>Logout</a></li>
                </ul>
            </nav>
            <div className={styles.hamburger} onClick={toggleMenu}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </div>
        </header>
    );
};

export default Header;
