import express from "express"

const router = express.Router();

import {login, authenticateToken, setAuthStopRequest} from "../middlewares/auth.js"

// login route
router.post('/login', login);

// auth check route
router.get('/auth-check' , setAuthStopRequest , authenticateToken);

// export
const authRouter = router
export default authRouter ;