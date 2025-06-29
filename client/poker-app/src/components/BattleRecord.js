import styles from '../styles/style.module.css';
import MyLineChart from "./LineChart.js";
import TableFlame from "./TableFlame.js";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import React, { useEffect, useState } from 'react';
import Score from './Score.js';
import {useUser} from '../hooks/useUser.js';


const Record = () => {
    const sampleData = [{total_chip:100, date:2024-1-1},{total_chip:-400,date:2024-1-2},{total_chip:200,date:2024-1-3}];
    const sampleCount = {losses:1,wins:2,games:3};
    const sampleTable = [
        {chip:100,total_chip:100, date:2024-1-1},
        {chip:-500,total_chip:-400,date:2024-1-2},
        {chip:600,total_chip:200,date:2024-1-3}
    ];
    
    const { user,isLoggedIn, loading } = useUser();
    const [data, setData] = useState([]);
    const [scoreData, setScoreData] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        if (!isLoggedIn || !user || loading) return;
            const fetchUserInfo = async () => {
                try {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data=docSnap.data();
                        const results=data.results;
                        if(results?.count){
                            setScoreData(results.count);
                            const formattedData = results.day_value.map((item) => {
                                const dateObj = new Date(item.date.seconds * 1000);
                                const dateString = dateObj.toLocaleDateString();
                                // total_chipを数値に変換
                                const totalChipValue = item.total_chip ? Object.values(item.total_chip)[0] : 0;
                                return {
                                    ...item,
                                    total_chip: totalChipValue,
                                    date: dateString
                                };
                            });
                            setData(formattedData);
                            const groupedData = {};
                            // データを日付ごとにグループ化
                            formattedData.forEach((item) => {
                                const { date, chip, total_chip } = item;
                                const totalChip = total_chip ?? 0;
                                if (!groupedData[date]) {
                                    groupedData[date] = { date, chip: 0, total_chip: 0 };
                                }
                                groupedData[date].chip += Number(chip);
                                groupedData[date].total_chip = totalChip;
                            });
                            const aggregatedData = Object.values(groupedData);
                            setTableData(aggregatedData);
                        }
                    } else {
                        alert("ユーザー情報が見つかりません!");
                    }
                } catch (error) {
                    alert("ユーザー情報取得中にエラーが発生しました！", error);
                }
            }
            fetchUserInfo();
    }, [user, isLoggedIn, loading]);

    return (
        <div>
            <div className={styles.background}>
                {isLoggedIn ? (
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
                        tData={sampleTable}
                    />
                    </>
                )}
            </div>
        </div>
    );
};

export default Record;