import express from "express"

const router = express.Router();

import {login, authenticateToken} from "../middlewares/auth.js"

// login route
router.post('/login', login);

// auth check route
router.get('/auth-check', authenticateToken);

// export
const authRouter = router
export default authRouter ;