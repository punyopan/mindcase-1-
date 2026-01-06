const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

    try {
        const verified = jwt.verify(
            token, 
            process.env.JWT_SECRET
        );
        req.user = verified;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
             return res.status(401).json({ message: 'Token Expired', code: 'TOKEN_EXPIRED' });
        }
        res.status(401).json({ message: 'Invalid Token' });
    }
};

exports.requireRole = (role) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Simple role hierarchy check could go here
    if (req.user.role !== role) {
        return res.status(403).json({ message: 'Forbidden: Insufficient Permissions' });
    }
    
    next();
};
