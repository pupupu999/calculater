import styles from '../styles/style.module.css';

const Spinner = () => {
    return (
        <div className={styles.spinnerContainer}>
            <div className={styles.loader}></div>
        </div>
    );
};

export default Spinner;