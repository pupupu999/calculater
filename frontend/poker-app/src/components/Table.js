import styles from '../styles/style.module.css';
import { Table } from "antd";


const TableFlame = ({tData}) => {
    console.log("テーブルデータ",tData);
    if (!tData || tData.length === 0) {
        // データが空の場合のエラーハンドリング
        return <p>データがありません</p>;
    }

    // 通算チップを計算するためのロジック
    let cumulativeChip = 0;

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
                    {tData.map((item, index) => {
                        // 通算チップの計算
                        cumulativeChip += item.chip;
                        return (
                            <tr key={index}>
                                <td>{item.date}</td>
                                <td>{item.chip}</td>
                                <td>{cumulativeChip}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TableFlame;