import styles from '../styles/style.module.css';
import { Table } from "antd";

const columns=[
    {
        title: "日付",
        dataIndex: "date",
        sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
        title: "その日の収支",
        dataIndex: "chip",
        dafaultSortOrder: "descend",
        sorter:(a, b) => a.chip - b.chip,
    },
    {
        title: "通算チップ",
        dataIndex: "total_chip",
    }
];

const TableFlame = ({tData}) => {
    console.log("テーブルデータ",tData);
    if (!tData || tData.length === 0) {
        // データが空の場合のエラーハンドリング
        return <p>データがありません</p>;
    }

    return (
        <div className={styles.tableContainer}>
            <Table
                className={styles.table}
                columns={columns}
                dataSource={tData}
                showSorterTooltip={{ target: "sorter-icon" }}
                pagination={{pageSize:5}}
            />
        </div>
    );
};

export default TableFlame;