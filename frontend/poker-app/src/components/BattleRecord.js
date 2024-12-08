import styles from '@/styles/style.module.css';
import MyLineChart from "@/components/LineChart";
import Table from "@/components/Table";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/pages/firebase";
import React, { useEffect, useState } from 'react';
import Score from '@/components/Score';


const Record = () => {
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState([]);
    const [data, setData] = useState([]);
    const [scoreData, setScoreData] = useState([]);
    useEffect(() => {
        const userid = sessionStorage.getItem('userid');
        const cleanedUserid = userid.trim().replace(/['"]+/g, '');
        if(cleanedUserid) {
            
            const fetchUserInfo = async () => {
                try {
                    const docRef = doc(db, 'users', cleanedUserid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUsername(docSnap.data().userid);
                        setUsers([{username: docSnap.data().userid, message: ''}]);
                        setScoreData(docSnap.data().results.count);
                        const formattedData = docSnap.data().results.day_value.map((item) => ({
                            // タイムスタンプを日付に変換
                            ...item,
                            date: new Date(item.date.seconds * 1000).toLocaleDateString() // 'seconds'を使用して変換
                        }));
                            setData(formattedData);
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
    }, []);

    return (
        <div>
            <div className={styles.background}>
                    <MyLineChart 
                        data = {data}
                    />
                    <Score
                        scoreData = {scoreData}
                    />
                    <Table />
            </div>
        </div>
    );
};

export default Record;