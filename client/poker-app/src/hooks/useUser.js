import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { useAuth } from "../contexts/AuthContext.js";

export const useUser = () => {
    const {currentUser, loading: authLoading} = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setUser(null);
            setLoading(false);
            return;
        }

            const fetchUserInfo = async () => {
                try {
                    const docRef = doc(db, 'users', currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data=docSnap.data();
                        const results=data.results;
                        setUser({
                            username:data.displayName || '',
                            scoreData:results?.count || {},
                            data:results?.day_value?.map((item)=>({
                                ...item,
                                date: new Date(item.date.seconds * 1000).toLocaleDateString(),
                            }))||[],
                            email:data.email,
                            uid:data.uid
                        });
                    } 
                } catch (error) {
                    console.error("ユーザー情報取得中にエラーが発生しました！", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchUserInfo();
    }, [currentUser]);

    return { user, loading: loading || authLoading, isLoggedIn: !!currentUser };
};