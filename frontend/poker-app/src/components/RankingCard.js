import styles from '../styles/style.module.css';

const RankingCard=({user})=>{
    return(
        <div className={styles.card}>
            <img src="/img/kurupin.png" alt="kurupin"/>
            <span>{user.username}</span>
            <div>{user.currentChip}</div>
        </div>
    )
}
export default RankingCard;