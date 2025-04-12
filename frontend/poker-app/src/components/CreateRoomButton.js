import React from 'react';
import styles from '../styles/style.module.css';

const CreateRoomButton = ({ onClick }) => {
    return (
        <div className={styles.cardButton} onClick={onClick}>
        {/* 背面カード */}
        <div className={styles.createBackCard}>
            <div className={`${styles.corner} ${styles.topLeft}`}>A♦</div>
            <div className={`${styles.corner} ${styles.bottomRight}`}>♦A</div>
        </div>
        {/* 前面カード */}
        <div className={styles.createFrontCard}>
            <div className={`${styles.corner} ${styles.topLeft}`}>A♥</div>
            <div className={`${styles.corner} ${styles.bottomRight}`}>A♥</div>
            <div className={styles.createCenterText}>
                Create<br />Room
            </div>
        </div>
        </div>
    );
};

export default CreateRoomButton;