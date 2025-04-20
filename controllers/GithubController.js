import { listFilesInRepo } from "../github-utils/GithubUtils.js";

const getFiles = async (req, res)=>{
    const filesList = await listFilesInRepo();
    return res.status(200).json({filesList});
}

export {getFiles}