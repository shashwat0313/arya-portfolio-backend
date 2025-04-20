import { sign, verify } from 'jsonwebtoken';

// Secret key for JWT
const SECRET_KEY = process.env.JWT_SIGN_SECRET

// Middleware for login
const login = (req, res) => {
    const { passcode } = req.body;

    // Replace 'your_passcode' with the actual passcode
    if (passcode === 'your_passcode') {
        // Generate JWT token with 24-hour expiry
        const token = sign({ user: 'authorizedUser' }, SECRET_KEY, { expiresIn: '24h' });
        return res.status(200).json({ token });
    } else {
        return res.status(401).json({ message: 'Invalid passcode' });
    }
};

// Middleware to check token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided or invalid format' });
    }

    const token = authHeader.split(' ')[1];

    verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Unauthorized: Invalid token' });
        }
        req.user = user;
        next();
    });
};

export default { login, authenticateToken };