import jwt from 'jsonwebtoken'
import dotenv from "dotenv"

dotenv.config()

// Secret key for JWT
const SECRET_KEY = process.env.JWT_SIGN_SECRET
const PASSCODE = process.env.PASSCODE

// Middleware for login
const login = (req, res) => {
    console.log("login req.body: ", req.body);
    
    const { passcode } = req.body;

    console.log("PASSCODE=" + PASSCODE, " and passcode in req.body=" + req.body.passcode);
    
    if (passcode === PASSCODE) {
        // Generate JWT token with 24-hour expiry
        const token = jwt.sign({ user: 'authorizedUser' }, SECRET_KEY, { expiresIn: '24h' });
        return res.status(200).json({ token });
    } else {
        return res.status(401).json({ message: 'Invalid passcode' });
    }
};

// Middleware to check token
const authenticateToken = (req, res, next) => {
    console.log("authenticateToken called");
    
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided or invalid format' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
        console.log("inside jwt verify cb");
        
        if (err) {
            return res.status(403).json({ message: 'Unauthorized: Invalid token' });
        }

        req.user = user;
        
        console.log("req user:" + JSON.stringify(req.user));

        if(!req.stopRequest){
            console.log("Allowing this request");
            next();      
        }
        else{ 
            return res.status(200).json({authenticated:true});
        }
    });
};

const setAuthStopRequest = (req, res, next) => {
    req.stopRequest = true;
    console.log("set stopRequest");
    
    next();
}

export { login, authenticateToken , setAuthStopRequest}; 