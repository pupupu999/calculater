import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../pages/firebase.js";

export const useUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const logined = sessionStorage.getItem('login') === 'true';
        if (!logined) {
            setUser(null);
            setLoading(false);
            return;
        }

        const userid = sessionStorage.getItem('userid');
        const cleanedUserid = userid?.trim().replace(/['"]+/g, '');
        if (cleanedUserid) {
            const fetchUserInfo = async () => {
                try {
                    const docRef = doc(db, 'users', cleanedUserid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        if(!docSnap.data().results?.count){
                            setUser({
                                username: docSnap.data().userid,
                                scoreData:{},
                                data: []
                            });
                        }else{
                            setUser({
                                username: docSnap.data().userid,
                                scoreData: docSnap.data().results.count,
                                data: docSnap.data().results.day_value.map((item) => ({
                                    ...item,
                                    date: new Date(item.date.seconds * 1000).toLocaleDateString()
                                }))
                            });
                        }
                    } else {
                        console.log("ユーザー情報が見つかりません!");
                    }
                } catch (error) {
                    console.error("ユーザー情報取得中にエラーが発生しました！", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchUserInfo();
        } else {
            window.location.href = '/login';
        }
    }, []);

    return { user, loading, isLoggedIn: !!user };
};