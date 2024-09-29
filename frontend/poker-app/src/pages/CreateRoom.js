import React from 'react';
import styles from '@/styles/style.module.css';

const CreateRoom = () => {
    return (
        <div className={styles.background}>
            <div className={styles.title}>ルーム作成</div>
            <div className={styles.textbox}>
                <input type="text" className={styles.input} placeholder="ルームID" />
                <input type="text" className={styles.input} placeholder="スタック" />
                <input type="text" className={styles.input} placeholder="参加人数" />
            </div>
            <div className={styles.createButtonLocation}>
                <button className={styles.button}>作成</button>
            </div>
        </div>
    );
}

export default CreateRoom;