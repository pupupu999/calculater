import styles from '../styles/style.module.css';

const sampleData={
    games:5,
    wins:4,
    losses:1
};

const Score = ({scoreData}) => {
    const displayData = (!scoreData || scoreData.length === 0) ? sampleData:scoreData;
    const winRate = displayData.wins / displayData.games * 100;
    const Rate = Math.round(winRate);

    return (
        <div className={styles.score}>
            <div className={styles.content}>ゲーム数: {displayData.games}回</div>
            <div className={styles.content}>勝利数: {displayData.wins}回</div>
            <div className={styles.content}>勝率: {Rate}%</div>
        </div>
    )
};

export default Score;