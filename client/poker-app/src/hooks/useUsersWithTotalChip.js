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
                    const lastTotalChip = data.results?.day_value?.at(-1)?.total_chip ?? 0;

                    return {
                        uid: data.uid || doc.id,
                        username: data.displayName || data.userid || "名無し",
                        email: data.email || "",
                        total_chip: lastTotalChip
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