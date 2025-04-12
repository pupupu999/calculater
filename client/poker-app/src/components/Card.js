import styles from '../styles/style.module.css';

const Card=({currentChip})=>{
    return(
        <div className={styles.card}>
            <img src="/img/kurupin.png" alt="kurupin" className={styles.cardKurupin}/>
            <div className={(currentChip>=0) ? styles.miniCardPlus : styles.miniCardMinus}>{(currentChip>=0) ? "+"+currentChip : currentChip}</div>
        </div>
    )
}
export default Card;