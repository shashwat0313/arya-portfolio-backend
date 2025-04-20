import express from "express"

const router = express.Router();

import {login, authenticateToken} from "../middlewares/auth"

// login route
router.get('/login', login);

// auth check route
router.get('/auth-check', authenticateToken);

// export
export default router;