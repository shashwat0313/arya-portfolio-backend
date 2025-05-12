import { 
    listFilesInRepo, 
    getFileContentUtil, 
    createBranchInRepo, 
    deleteBranchFromRepo, 
    processFileCommit, 
    getLatestActionsStatus, 
    getLatestSuccessfulDeploymentTime 
} from "../services/GithubService.js";

const getFiles = async (req, res)=> {
    const filesList = await listFilesInRepo();
    return res.status(200).json({filesList});
}

const getFileContent = async (req, res) => {
    console.log("req.params: " + JSON.stringify(req.params));
    
    const branch = decodeURIComponent(req.query.branch);
    const filepath = decodeURIComponent(req.query.filepath); // Decode the URL-encoded filepath
    console.log(`Decoded filepath: ${filepath}, branch: ${branch}`);
    
    const content = await getFileContentUtil(filepath, branch);
    return res.status(200).json({content});
}

const createBranch = async (req, res) => {
    const branchName = req.body.branchName;
    const result = await createBranchInRepo(branchName);

    return res.status(201).json(result);
}

const deleteBranch = async (req, res) => {
    const branchName = decodeURIComponent(req.query.branchName); // Extract branch name from query params

    try {
        const result = await deleteBranchFromRepo(branchName); // Pass branch name to the service
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in deleteBranchController:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

const commitCreateOrUpdateFile = async (req, res) => {
    try {
        const { filePath, content, commitMessage } = req.body;

        if (!filePath || !content || !commitMessage) {
            return res.status(400).json({ error: "filePath, content, and commitMessage are required." });
        }

        const result = await processFileCommit({ filePath, content, commitMessage });
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in commitCreateOrUpdateFile controller:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

const getActionsStatus = async (req, res) => {
    try {
        const status = await getLatestActionsStatus();
        return res.status(200).json(status);
    } catch (error) {
        console.error("Error in getActionsStatus controller:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

const getLatestSuccessfulDeployment = async (req, res) => {
    try {
        const result = await getLatestSuccessfulDeploymentTime();
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in getLatestSuccessfulDeployment controller:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

export { 
    getFiles, 
    getFileContent, 
    createBranch, 
    deleteBranch, 
    commitCreateOrUpdateFile, 
    getActionsStatus, 
    getLatestSuccessfulDeployment 
};