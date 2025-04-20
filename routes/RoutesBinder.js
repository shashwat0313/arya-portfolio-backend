import authRouter from "./authRouter.js";
import githubRouter from "./githubRouter.js";
import { authenticateToken } from "../middlewares/auth.js";

const routesBinder = (app) => {
    app.use("/auth", authRouter);

    // protected routes
    app.use("/github-api", authenticateToken, githubRouter);
}

export default routesBinder;