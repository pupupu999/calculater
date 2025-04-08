import styles from '../styles/style.module.css';
import { Table } from "antd";

//データが空の場合のデフォルトデータ
const sampleData=[
    {date:"2025-01-01",chip:100,total_chip:100},
    {date:"2025-01-02",chip:300,total_chip:400},
    {date:"2025-01-03",chip:-500,total_chip:-100},
    {date:"2025-01-04",chip:400,total_chip:300},
    {date:"2025-01-05",chip:200,total_chip:500}
];

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
    if (!tData || tData.length === 0) {
        // データが空の場合のエラーハンドリング
        return (
            <div className={styles.tableContainer}>
                <Table
                    rowKey="date"
                    className={styles.table}
                    columns={columns}
                    dataSource={sampleData}
                    showSorterTooltip={{ target: "sorter-icon" }}
                    pagination={{pageSize:5}}
                />
            </div>
        );
    }

    return (
        <div className={styles.tableContainer}>
            <Table
                rowKey="date"
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