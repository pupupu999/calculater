import React from 'react';
import styles from '../styles/style.module.css';

const SearchRoomButton = ({ onClick }) => {
    return (
        <div className={styles.cardButton} onClick={onClick}>
        {/* 背面カード */}
        <div className={styles.searchBackCard}>
            <div className={`${styles.corner} ${styles.topLeft}`}>7♦</div>
            <div className={`${styles.corner} ${styles.bottomRight}`}>7♦</div>
        </div>
        {/* 前面カード */}
        <div className={styles.searchFrontCard}>
            <div className={`${styles.corner} ${styles.topLeft}`}>2♥</div>
            <div className={`${styles.corner} ${styles.bottomRight}`}>2♥</div>
            <div className={styles.searchCenterText}>
                Search<br />Room
            </div>
        </div>
        </div>
    );
};

export default SearchRoomButton;