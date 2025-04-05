import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine} from 'recharts';
import styles from '../styles/style.module.css';

//データが空の場合のデフォルトデータ
const sampleData=[
    {date:"2025-01-01",total_chip:100},
    {date:"2025-01-02",total_chip:400},
    {date:"2025-01-03",total_chip:-100},
    {date:"2025-01-04",total_chip:300},
    {date:"2025-01-05",total_chip:500}
];

const MyLineChart = ({data}) => {
    const displayData = (!data || data.length === 0) ? sampleData : data;

    // データから最小値と最大値を計算
    const minValue = Math.min(...displayData.map((d) => d["total_chip"]));
    const maxValue = Math.max(...displayData.map((d) => d["total_chip"]));
    const range = Math.max(Math.abs(minValue), Math.abs(maxValue)); // 絶対値の大きい方を取得

    // メモリ範囲を計算 (400単位刻みに調整)
    const tickStep = 400;
    const ticks = [];

    for (let i = -Math.ceil(range / tickStep) * tickStep; i <= Math.ceil(range / tickStep) * tickStep; i += tickStep) {
        ticks.push(i);
    }


    return (
        <div className = {styles.chart}>
            {displayData.length > 0 ? (
                <LineChart width={600} height={300} data={displayData}>
                    <CartesianGrid strokeDasharray="3 3" fill='#ffffff'/>
                    <XAxis dataKey="date" />
                    <YAxis 
                        dataKey="total_chip"
                        domain={[-Math.ceil(range / tickStep) * tickStep, Math.ceil(range / tickStep) * tickStep]} // -range～+rangeに設定
                        ticks={ticks} // カスタムメモリ (400刻み)
                        tickFormatter={(tick) => tick.toLocaleString()} // メモリを見やすく
                        tickCount={10}
                        allowDataOverflow={true}
                    />
                    <Tooltip />
                    <Legend />
                    {/*y=0の部分だけ太線を表示する*/}
                    <ReferenceLine y={0} strokeDasharray="black" strokeWidth={1} />
                    <Line type="monotone" dataKey="total_chip" stroke="#82ca9d" />
                </LineChart>
            ) : (
                <p>データを読み込み中...</p>
            )}
        </div>
    );
};

export default MyLineChart;