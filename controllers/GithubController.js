import { listFilesInRepo , getFileContentUtil} from "../github-utils/GithubUtils.js";

const getFiles = async (req, res)=>{
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

export {getFiles, getFileContent}