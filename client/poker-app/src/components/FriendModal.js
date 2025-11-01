import { FaSearch, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { useState, useMemo, useEffect } from 'react';
import FriendList from './FriendList.js';

const FriendModal = ({ isOpen, onClose, isLoading, friends, onProxySubmit }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [mode, setMode] = useState('search'); // 'search' or 'input'
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [rebuyValue, setRebuyValue] = useState('');

    // モーダルが閉じられたときに検索クエリと状態をリセット
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
            setMode('search');
            setSelectedFriend(null);
            setInputValue('');
            setRebuyValue('');
        }
    }, [isOpen]);

    const filteredFriends = useMemo(() => {
        if (!searchQuery.trim()) {
            return friends;
        }
        const query = searchQuery.toLowerCase().trim();
        return friends.filter(friend => {
            const displayName = (friend.displayName || friend.username || '').toLowerCase();
            const email = (friend.email || '').toLowerCase();
            return displayName.includes(query) || email.includes(query);
        });
    }, [friends, searchQuery]);

    const handleFriendSelect = (friend) => {
        setSelectedFriend(friend);
        setMode('input');
    };

    const handleBackToSearch = () => {
        setMode('search');
        setSelectedFriend(null);
        setInputValue('');
        setRebuyValue('');
    };

    const handleSubmit = () => {
        if (!inputValue || inputValue.trim() === '') {
            alert('スタックを入力してください');
            return;
        }
        if (!selectedFriend) {
            alert('フレンドが選択されていません');
            return;
        }
        if (onProxySubmit) {
            const friendUsername = selectedFriend.username || selectedFriend.displayName;
            const friendUid = selectedFriend.uid || null;
            const rebuy = rebuyValue.trim() === '' ? 0 : Number(rebuyValue);
            onProxySubmit(friendUsername, inputValue, rebuy, friendUid);
            onClose();
        } else {
            console.error('onProxySubmitコールバックが提供されていません');
        }
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.35)',
                zIndex: 9999,
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'min(720px, 92%)',
                    background: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    padding: 16,
                    maxHeight: '80vh',
                    overflowY: 'auto',
                }}
            >
                {mode === 'search' ? (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                            <h1 style={{ fontSize: 18, margin: 0 }}>フレンド検索</h1>
                            <button
                                onClick={onClose}
                                aria-label="close"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 8,
                                    lineHeight: 0,
                                }}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <FaSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#888', pointerEvents: 'none' }} />
                            <input
                                type="text"
                                placeholder="ユーザー名を入力してください"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    paddingLeft: 40,
                                    height: 40,
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    borderRadius: 8,
                                    border: '1px solid #ddd',
                                    outline: 'none',
                                }}
                            />
                        </div>
                        {isLoading ? (
                            <div style={{ marginTop: 16 }}>
                                <style>
                                    {`
                                    @keyframes skeleton-shimmer { 
                                        0% { background-position: -200px 0; }
                                        100% { background-position: calc(200px + 100%) 0; }
                                    }
                                    `}
                                </style>
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                        <div
                                            style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '50%',
                                                background: '#eee',
                                                backgroundImage: 'linear-gradient(90deg, #eee 0px, #f5f5f5 40px, #eee 80px)',
                                                backgroundSize: '200px 100%',
                                                animation: 'skeleton-shimmer 1.2s ease-in-out infinite',
                                                flexShrink: 0,
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div
                                                style={{
                                                    height: 12,
                                                    width: '60%',
                                                    borderRadius: 6,
                                                    background: '#eee',
                                                    backgroundImage: 'linear-gradient(90deg, #eee 0px, #f5f5f5 40px, #eee 80px)',
                                                    backgroundSize: '200px 100%',
                                                    animation: 'skeleton-shimmer 1.2s ease-in-out infinite',
                                                    marginBottom: 8,
                                                }}
                                            />
                                            <div
                                                style={{
                                                    height: 10,
                                                    width: '40%',
                                                    borderRadius: 5,
                                                    background: '#eee',
                                                    backgroundImage: 'linear-gradient(90deg, #eee 0px, #f5f5f5 40px, #eee 80px)',
                                                    backgroundSize: '200px 100%',
                                                    animation: 'skeleton-shimmer 1.2s ease-in-out infinite',
                                                }}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                width: 72,
                                                height: 28,
                                                borderRadius: 6,
                                                background: '#eee',
                                                backgroundImage: 'linear-gradient(90deg, #eee 0px, #f5f5f5 40px, #eee 80px)',
                                                backgroundSize: '200px 100%',
                                                animation: 'skeleton-shimmer 1.2s ease-in-out infinite',
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <FriendList friends={filteredFriends} onFriendSelect={handleFriendSelect} />
                        )}
                    </>
                ) : (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                            <button
                                onClick={handleBackToSearch}
                                aria-label="back"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 8,
                                    lineHeight: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    color: '#121212',
                                }}
                            >
                                <FaArrowLeft />
                                <span>戻る</span>
                            </button>
                            <button
                                onClick={onClose}
                                aria-label="close"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 8,
                                    lineHeight: 0,
                                }}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div style={{ padding: '24px 0' }}>
                            <h2 style={{ fontSize: 20, display: 'flex', alignItems: 'center', gap: 12, width: 'fit-content', margin: '0 auto 8px auto' }}>
                                <img
                                    src="/img/postman.png"
                                    alt="postman"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        objectFit: 'contain',
                                    }}
                                />
                                {selectedFriend?.displayName || selectedFriend?.username || 'フレンド'}への代理入力
                            </h2>
                            <div style={{ marginBottom: 16 }}>
                                <input
                                    type="number"
                                    placeholder="最終スタックを入力"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        fontSize: 16,
                                        borderRadius: 8,
                                        border: '1px solid #ddd',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        marginBottom: 12,
                                    }}
                                    autoFocus
                                />
                                <input
                                    type="number"
                                    placeholder="リバイ額を入力"
                                    value={rebuyValue}
                                    onChange={(e) => setRebuyValue(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        fontSize: 16,
                                        borderRadius: 8,
                                        border: '1px solid #ddd',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                style={{
                                    width: '30%',
                                    padding: '12px',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    backgroundColor: '#121212',
                                    border: 'none',
                                    borderRadius: 8,
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s',
                                    margin: '0 auto',
                                    display: 'block',
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#121212'}
                            >
                                送信
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FriendModal; 