import React from 'react';
import styles from '@/styles/style.module.css';

const MyPage = () => {
    const handleClick = (event) => {
        alert('ボタンがクリックされました');
    }

    return (
        <div className={styles.background}>
            <span className={styles.username}>山田太郎</span>
            <span className={styles.userid}>ID:00000001</span>
            <hr className={styles.line}/>
            <div className={styles.main}>
                <div className={styles.button_row}>
                    <div className={styles.image_container_topcenter}>
                        <img src="/img/tip_button_room_create.png" alt="Tip Button1" onClick={handleClick} />
                    </div>
                    <div className={styles.image_container_topcenter}>
                        <img src="/img/tip_button_room_create.png" alt="Tip Button2" onClick={handleClick} />
                    </div>
                </div>
                <div className={styles.button_row}>
                    <div className={styles.image_container_topcenter}>
                        <img src="/img/tip_button_room_create.png" alt="Tip Button1" onClick={handleClick} />
                    </div>
                    <div className={styles.image_container_topcenter}>
                        <img src="/img/tip_button_room_create.png" alt="Tip Button4" onClick={handleClick} />
                    </div>
                </div>
                <div className={styles.button_row}>
                    <div className={styles.image_container_bottom}>
                        <img src="/img/tip_button_room_create.png" alt="Tip Button5" onClick={handleClick} />
                    </div>
                </div>
            </div>
            <div className={styles.footer}></div>
        </div>
    );
};

export default MyPage;