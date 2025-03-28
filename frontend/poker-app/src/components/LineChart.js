import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine} from 'recharts';
import styles from '../styles/style.module.css';

const MyLineChart = ({data}) => {
    console.log("データの確認",data);

    if (!data || data.length === 0) {
        // データが空の場合のエラーハンドリング
        return <p>データがありません</p>;
    }

    // データから最小値と最大値を計算
    const minValue = Math.min(...data.map((d) => d["total_chip"]));
    const maxValue = Math.max(...data.map((d) => d["total_chip"]));
    const range = Math.max(Math.abs(minValue), Math.abs(maxValue)); // 絶対値の大きい方を取得

    // メモリ範囲を計算 (400単位刻みに調整)
    const tickStep = 400;
    console.log("retickStep",tickStep);
    console.log("range",range);
    const ticks = [];

    for (let i = -Math.ceil(range / tickStep) * tickStep; i <= Math.ceil(range / tickStep) * tickStep; i += tickStep) {
        ticks.push(i);
    }


    return (
        <div className = {styles.chart}>
            {data.length > 0 ? (
                <LineChart width={600} height={300} data={data}>
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