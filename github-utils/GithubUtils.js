import { Octokit } from "@octokit/rest";
import dotenv from "dotenv"

dotenv.config();

const octokit = new Octokit({
    auth: process.env.GITHUB_PAT, // Replace with your GitHub token
});

const owner = "aryashrestha105"; // Replace with the repository owner (e.g., "octocat")
const repo = "arya-portfolio";   // Replace with the repository name (e.g., "Hello-World")
const branch = "main";      // Replace with the branch name (e.g., "main")


async function listFilesInRepo() {
    try {
        // Get the reference (commit SHA) of the branch
        const branchData = await octokit.rest.repos.getBranch({
            owner,
            repo,
            branch,
        });

        console.log("branchdata: " + branchData);

        const sha = branchData.data.commit.sha;

        // Get the tree of the branch
        const treeData = await octokit.rest.git.getTree({
            owner,
            repo,
            tree_sha: sha,
            recursive: true, // Set to true to get all files recursively
        });

        const files = treeData.data.tree
            .filter(item => item.type === "blob") // Filter only files (blobs)
            .map(file => file.path); // Get the file paths

        console.log("Files in the repository:", files);
        return files;
    } catch (error) {
        console.error("Error fetching files:", error);
    }
}

export {listFilesInRepo};