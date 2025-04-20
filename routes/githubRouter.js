import express from "express"
import { getFiles } from "../controllers/GithubController.js";

const router = express.Router();

router.get("/files-list", getFiles);

const githubRouter = router;
export default githubRouter;