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
                    const currentTotalChip = data.results?.current_month_total_chip ?? 0;
                    const monthTotalChip = data.results?.monthly_summary ?? {};
                    return {
                        uid: data.uid || doc.id,
                        username: data.displayName || data.userid || "名無し",
                        email: data.email || "",
                        current_total_chip: currentTotalChip,
                        monthly_total_chip: monthTotalChip
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