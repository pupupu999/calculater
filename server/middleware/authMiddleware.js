import admin from 'firebase-admin';

export const checkAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
        console.log('checkAuth: No token provided');
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('checkAuth: Invalid token', error.message);
        res.status(403).json({ message: 'Invalid token' });
    }
};