import express from "express";
import { 
    getFiles, 
    getFileContent, 
    createBranch, 
    deleteBranch, 
    commitCreateOrUpdateFile, 
    getActionsStatus, 
    getLatestSuccessfulDeployment 
} from "../controllers/GithubController.js";

const router = express.Router();

router.get("/files-list", getFiles);
router.get("/file-content", getFileContent);

// create branch
router.post("/create-branch", createBranch);
router.delete("/delete-branch", deleteBranch);

// commit create or update file
router.post("/commit-file", commitCreateOrUpdateFile);

// get GitHub Actions status
router.get("/actions-status", getActionsStatus);

// Get latest successful deployment timing
router.get("/latest-successful-deployment", getLatestSuccessfulDeployment);

const githubRouter = router;
export default githubRouter;