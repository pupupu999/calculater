import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer} from 'recharts';
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
    const displayData = (!data || data.length === 0) 
    ? sampleData 
    : data.map(({ date, total_chip }) => ({
        date,
        total_chip
    }));

    // データから最小値と最大値を計算
    const minValue = Math.min(...displayData.map((d) => d["total_chip"]));
    const maxValue = Math.max(...displayData.map((d) => d["total_chip"]));
    // 少し余裕を持たせるためのバッファ
    const buffer = 800;

    // メモリ範囲を計算 (400単位刻みに調整)
    const tickStep = 400;

    // Y軸の最小・最大を調整（bufferを加える）
    const adjustedMin = Math.floor((minValue - buffer) / tickStep) * tickStep;
    const adjustedMax = Math.ceil((maxValue + buffer) / tickStep) * tickStep;

    // ticks を adjustedMin〜adjustedMax の範囲で生成
    const ticks = [];
    for (let i = adjustedMin; i <= adjustedMax; i += tickStep) {
        ticks.push(i);
    }

    return (
        <div className = {styles.chart}>
            {displayData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayData}>
                    <CartesianGrid strokeDasharray="3 3" fill="#ffffff"/>
                    <XAxis 
                        dataKey="date"
                        axisLine={{ stroke: "#000", strokeWidth: 1 }}
                    />
                    <YAxis 
                        dataKey="total_chip"
                        domain={[adjustedMin, adjustedMax]}
                        ticks={ticks}
                        tickFormatter={(tick) => tick.toLocaleString()}
                        tickCount={10}
                        allowDataOverflow={true}
                        axisLine={{ stroke: "#000", strokeWidth: 1 }}
                    />
                    <Tooltip />
                    <Legend />
                    <ReferenceLine y={0} strokeDasharray="black" strokeWidth={2} />
                    <Line type="monotone" dataKey="total_chip" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
            ) : (
                <p>データを読み込み中...</p>
            )}
        </div>
    );
};

export default MyLineChart;