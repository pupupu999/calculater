import styles from '../styles/style.module.css';
import MyLineChart from "./LineChart.js";
import TableFlame from "./Table.js";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../pages/firebase.js";
import React, { useEffect, useState } from 'react';
import Score from './Score.js';


const Record = ({login}) => {
    const sampleData = [{chip:100, date:2024-1-1},{chip:-400,date:2024-1-2},{chip:200,date:2024-1-3}]
    const sampleCount = {losses:5,wins:5,games:10}
    
    const [data, setData] = useState([]);
    const [scoreData, setScoreData] = useState([]);
    const [tableData, setTableData] = useState([]);
    console.log("ログイン状態",login);
    useEffect(() => {
        if (!login) return;
        const userid = sessionStorage.getItem('userid');
        const cleanedUserid = userid.trim().replace(/['"]+/g, '');
        if(cleanedUserid) {
            const fetchUserInfo = async () => {
                try {
                    const docRef = doc(db, 'users', cleanedUserid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setScoreData(docSnap.data().results.count);
                        const formattedData = docSnap.data().results.day_value.map((item) => ({
                            // タイムスタンプを日付に変換
                            ...item,
                            date: new Date(item.date.seconds * 1000).toLocaleDateString() // 'seconds'を使用して変換
                        }));
                            setData(formattedData);

                            const groupedData = {};

                            // データを日付ごとにグループ化
                            formattedData.forEach((item) => {
                                const {date, chip, total_chip } = item;
                                if (!groupedData[date]) {
                                    groupedData[date] = { date, chip: 0, total_chip: 0 };
                                }
                                groupedData[date].chip += chip;
                                //total_chip は最後の要素の値を保持
                                // if (typeof total_chip === 'number') {
                                    groupedData[date].total_chip = total_chip;
                                // } else {
                                //     console.error('Invalid total_chip value:', total_chip);
                                // }
                            });

                            const aggregatedData = Object.values(groupedData);
                            console.log("aggregatedData",aggregatedData);
                            setTableData(aggregatedData);
                    } else {
                        console.log(docSnap.data());
                        console.log("ユーザー情報が見つかりません!");
                    }
                } catch (error) {
                    console.error("ユーザー情報取得中にエラーが発生しました！", error);
                }
            }

            fetchUserInfo();
        } else {
            console.log("ユーザー情報がありません。ログインしてください。");
            window.location.href = '/login';
        }
    }, [login]);

    return (
        <div>
            <div className={styles.background}>
                {login ? (
                    <>
                    <MyLineChart 
                        data = {data}
                    />
                    <Score
                        scoreData = {scoreData}
                    />
                    <TableFlame 
                        tData={tableData}
                    />
                    </>
                ) : (
                    <>
                    <MyLineChart 
                        data = {sampleData}
                    />
                    <Score
                        scoreData = {sampleCount}
                    />
                    <TableFlame 
                        tData={tableData}
                    />
                    </>
                )}
            </div>
        </div>
    );
};

export default Record;