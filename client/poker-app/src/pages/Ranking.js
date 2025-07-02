import React, { useEffect, useState } from 'react';
import styles from '../styles/style.module.css';
import RankingCard from '../components/RankingCard.js';
import RankingTable from '../components/RankingTable.js';
import Header from '../components/Header.js';
import Spinner from '../components/Spinner.js';
import { useUser } from '../hooks/useUser.js';
import { useUsers } from '../hooks/useUsersWithTotalChip.js';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const Ranking = () => {
    const navigate = useNavigate();
    const { user, loading, isLoggedIn } = useUser();
    const { users, rankLoading, error } = useUsers();
    const pageName = "Ranking";

    const [monthOptions, setMonthOptions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            navigate('/login');
        }
    }, [loading, isLoggedIn, navigate]);

    useEffect(() => {
        if (users && users.length > 0) {
            const options = Array.from(new Set(
                users.flatMap(user => Object.keys(user.monthly_total_chip))
            )).map(m => ({ value: m, label: m }));

            setMonthOptions(options);
            if (!selectedMonth && options.length > 0) {
                setSelectedMonth(options[0]);
            }
        }
    }, [users]);

    if (loading || rankLoading || !selectedMonth) {
        return <Spinner />;
    }

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const sortedUsers = [...users]
        .map(u => ({
            ...u,
            month_chip: selectedMonth.value === currentMonth
                ? u.current_total_chip ?? 0
                : u.monthly_total_chip[selectedMonth.value]?.total_chip ?? 0
        }))
        .sort((a, b) => b.month_chip - a.month_chip);

    let currentRank = 1;
    let previousChip = null;

    const usersWithRank = sortedUsers.map((u, index) => {
        if (u.month_chip !== previousChip) {
            currentRank = index + 1;
        }
        previousChip = u.month_chip;
        return { ...u, rank: currentRank };
    });

    const userWithRank = usersWithRank.find((u) => u.uid === user.uid);

    if (!userWithRank) {
        return <Spinner />;
    }

    return(
        <div className={styles.background}>
            <Header pageName={pageName} />
            {monthOptions.length > 0 && selectedMonth && (
                <div className={styles.selectContainer}>
                    <Select
                        className={styles.selectBox}
                        options={monthOptions}
                        value={selectedMonth}
                        onChange={(option) => setSelectedMonth(option)}
                    />
                </div>
            )}
            <div className={styles.rankingMain}>
                <div className={styles.userRankContainer}>
                    <RankingCard 
                        user={userWithRank}
                        rank={userWithRank.rank}
                    />
                </div>
                <div className={styles.rankingContainer}>
                    <RankingTable 
                        users={usersWithRank}
                        loading={rankLoading}
                        error={error}
                    />
                </div>
            </div>
        </div>
    );
};

export default Ranking;