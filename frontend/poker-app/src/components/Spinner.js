const Spinner = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <div className="loader"></div>
            <style>{`
                .loader {
                    border: 8px solid #f3f3f3;
                    border-top: 8px solid #555;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};
export default Spinner;