import RankingCard from './RankingCard.js';

const RankingTable=({users, loading, error})=>{
    if(loading) return(<div>読み込み中です...</div>);

    if(error) return(<div>エラーが発生しました</div>);

    return(
        <ul>
            {users.map((user,index)=>(
                <RankingCard
                    key={user.username}
                    user={user}
                    rank={index+1}
                />
            ))}
        </ul>
    );
};

export default RankingTable;