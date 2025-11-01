const getBaseURL = () => {
    const hostname = window.location.hostname;
    
    // localhostまたは127.0.0.1の場合
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3001';
    }
    
    // ローカルネットワークIPアドレスの場合（192.168.x.x, 10.x.x.x, 172.16-31.x.x）
    if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(hostname)) {
        return `http://${hostname}:3001`;
    }
    
    // その他の場合（本番環境など）
    return 'https://chipin-fdzx.onrender.com';
};

export const baseURL = getBaseURL();