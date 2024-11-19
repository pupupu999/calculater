import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MyLineChart = ({data}) => {
    console.log("データの確認",data);
    return (
        <div>
            <h1>戦績折れ線チャート</h1>
            {data.length > 0 ? (
                <LineChart width={600} height={300} data={data}>
                    <CartesianGrid strokeDasharray="3 3" fill='#ffffff'/>
                    <XAxis dataKey="date" />
                    <YAxis dataKey="chip"/>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="chip" stroke="#82ca9d" />
                </LineChart>
            ) : (
                <p>データを読み込み中...</p>
            )}
        </div>
    );
};

export default MyLineChart;