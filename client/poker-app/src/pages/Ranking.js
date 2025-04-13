import React, { useEffect } from 'react';
import styles from '../styles/style.module.css';
import RankingCard from '../components/RankingCard.js';
import RankingTable from '../components/RankingTable.js';
import Header from '../components/Header.js';
import Spinner from '../components/Spinner.js';
import { useUser } from '../hooks/useUser.js';
import { useUsers } from '../hooks/useUsersWithTotalChip.js';
import { useNavigate } from 'react-router-dom';

const Ranking = () => {
    const navigate = useNavigate();
    const { user, loading, isLoggedIn } = useUser();
    const { users, rankLoading, error } = useUsers();

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            navigate('/login');
        }
    }, [loading, isLoggedIn, navigate]);

    if (loading || rankLoading) {
        return <Spinner />;
    }

    const sortedUsers = [...users].sort((a, b) => b.total_chip - a.total_chip);
    
    const userInfo = sortedUsers.find((sortedUser) => user.username === sortedUser.username);

    const userWithRank = userInfo
        ? {
            ...userInfo,
            rank: sortedUsers.findIndex(u => u.username === user.username) + 1
        }
        : null;

    if (!userWithRank) {
        return <Spinner />;
    }

    return(
        <div className={styles.background}>
            <Header />
            <span className={styles.pagename}>Ranking</span>
            <hr className={styles.rankLine}/>
            <div className={styles.rankingMain}>
                <div className={styles.userRankContainer}>
                    <RankingCard 
                        user={userWithRank}
                        rank={userWithRank.rank}
                />
                </div>
                <div className={styles.rankingContainer}>
                    <RankingTable 
                        users={sortedUsers}
                        loading={rankLoading}
                        error={error}
                />
                </div>
            </div>
        </div>
    );
};

export default Ranking;