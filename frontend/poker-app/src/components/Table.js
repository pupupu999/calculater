import styles from '../styles/style.module.css';

const Table = () => {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>日付</th>
                        <th>その日の収支</th>
                        <th>通算チップ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>2021/07/01</td>
                        <td>1000</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>2021/07/02</td>
                        <td>-500</td>
                        <td>500</td>
                    </tr>
                    <tr>
                        <td>2021/07/03</td>
                        <td>2000</td>
                        <td>2500</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Table;