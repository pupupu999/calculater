import styles from '../styles/style.module.css';

const Score = ({scoreData}) => {
    const winRate = scoreData.wins / scoreData.games * 100;
    const Rate = Math.round(winRate);
    return (
        <div className={styles.score}>
            <div className={styles.content}>ゲーム数: {scoreData.games}回</div>
            <div className={styles.content}>勝利数: {scoreData.wins}回</div>
            <div className={styles.content}>勝率: {Rate}%</div>
        </div>
    )
};

export default Score;