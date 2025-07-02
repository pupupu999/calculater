import styles from '../styles/style.module.css';

const getRankOrdinal = (rank)=>{
    switch (rank){
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
};

const getRankImage = (rank)=>{
    switch (rank){
        case 1: return '/img/king.png';
        case 2: return '/img/queen.png';
        case 3: return '/img/jack.png';
        default: return '/img/kurupin.png';
    }
};

const RankingCard=({user,rank})=>{
    return(
        <div className={styles.cardSet}>
            <div className={styles.rank}>{rank}{getRankOrdinal(rank)}</div>
            <div className={`${styles.rankingCard} ${rank === 1 ? styles.first : rank === 2 ? styles.second : rank === 3 ? styles.third : ''}`}>
                <div className={styles.rankingIcon}>
                    <img src={getRankImage(rank)} alt="king" className={styles.rankingKurupin}/>
                    <span className={styles.rankingUsername}>{user.username}</span>
                </div>
                <div className={styles.rankingMiniCard}>{user.month_chip}</div>
            </div>
        </div>
    )
}
export default RankingCard;