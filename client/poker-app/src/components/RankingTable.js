import RankingCard from './RankingCard.js';

const RankingTable=({users, loading, error})=>{
    if(loading) return(<div>読み込み中です...</div>);

    if(error) return(<div>エラーが発生しました</div>);

    return(
        <ul>
            {users.map((user)=>(
                <RankingCard
                    key={user.uid}
                    user={user}
                    rank={user.rank}
                />
            ))}
        </ul>
    );
};

export default RankingTable;