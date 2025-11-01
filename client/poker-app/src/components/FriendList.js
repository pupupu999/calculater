import styles from '../styles/style.module.css';

const FriendList = ({ friends = [], onFriendSelect }) => {

    const handleFriendClick = (friend) => {
        if (onFriendSelect) {
            onFriendSelect(friend);
        }
    };

    return (
        <div style={{ marginTop: 16 }}>
            <div className={styles.resultsList}>
                {friends.length === 0 ? (
                    <div className={styles.friendItem}>フレンドがいません</div>
                ) : (
                    friends.map((f, idx) => (
                        <div key={f.uid || f.id || idx} className={styles.userItem} onClick={() => handleFriendClick(f)}>
                            <span>{f.displayName || '-'}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FriendList;