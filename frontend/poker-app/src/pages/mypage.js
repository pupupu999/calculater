import React from 'react';
import styles from '@/styles/style.module.css';
import Header from "@/components/Header";
import Record from "@/components/BattleRecord";
import { useRouter } from 'next/router';

const MyPage = () => {
    const router = useRouter();
    const handleNavication = (path) => {
        router.push(path);
    }

    return (
        <div className={styles.background}>
            <Header />
            <span className={styles.username}>山田太郎</span>
            <span className={styles.userid}>ID:00000001</span>
            <hr className={styles.line}/>
            <div className={styles.main}>
                <div className={styles.title}>
                    <div className={styles.kurupin}>
                        <img src="/img/kurupin.png" alt="kurupin" />
                    </div>
                    <div className={styles.button_row}>
                        <div className={styles.image_container_topcenter}>
                            <img src="/img/room_cre.png" alt="create room" onClick={() => handleNavication('/CreateRoom')} />
                        </div>
                        <div className={styles.image_container_topcenter}>
                            <img src="/img/room_ser.png" alt="search room" onClick={() => handleNavication('/JoinRoom')} />
                        </div>
                    </div>
                </div>
                <div className = {styles.record}>
                    <Record />
                </div>
            </div>
            <div className={styles.footer}></div>
        </div>
    );
};

export default MyPage;