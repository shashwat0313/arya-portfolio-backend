import express from "express"
import { getFiles, getFileContent } from "../controllers/GithubController.js";

const router = express.Router();

router.get("/files-list", getFiles);
router.get("/file-content", getFileContent);

const githubRouter = router;
export default githubRouter;