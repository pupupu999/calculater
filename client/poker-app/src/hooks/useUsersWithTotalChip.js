import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [rankLoading, setRankLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersSnap = await getDocs(collection(db, 'users'));
                const usersData = usersSnap.docs.map(doc => {
                    const data = doc.data();
                    const monthlyTotalChip = data.results?.current_month_total_chip ?? 0;

                    return {
                        uid: data.uid || doc.id,
                        username: data.displayName || data.userid || "名無し",
                        email: data.email || "",
                        month_total_chip: monthlyTotalChip
                    };
                });
                setUsers(usersData);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError(err);
            } finally {
                setRankLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { users, rankLoading, error };
};