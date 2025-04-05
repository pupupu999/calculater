import {useEffect, useState } from "react";
import { collection, getDocs} from "firebase/firestore";
import { db } from "../pages/firebase.js";

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [rankLoading, setrankLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try{
                const usersSnap=await getDocs(collection(db, 'users'));
                const usersData=usersSnap.docs.map(doc => {
                    const data=doc.data();
                    if(!data.results?.count){
                        return{
                            username: data.userid,
                            total_chip: 0
                        };
                    }else{
                        return{
                            username: data.userid,
                            total_chip: data.results?.day_value[data.results.day_value.length-1].total_chip
                        }
                    }
                });
                setUsers(usersData);
            }catch(err){
                console.error('Error fetching users:', err);
                setError(err);
            }finally{
                setrankLoading(false);
            }
        };
        fetchUsers();
    },[]);

    return {users, rankLoading, error};
};