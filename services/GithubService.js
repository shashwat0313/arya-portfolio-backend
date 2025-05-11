import { Octokit } from "@octokit/rest";
import dotenv from "dotenv"

dotenv.config();

const octokit = new Octokit({
    auth: process.env.GITHUB_PAT, // Replace with your GitHub token
});

const owner = "aryashrestha105"; // Replace with the repository owner (e.g., "octocat")
const repo = "arya-portfolio";   // Replace with the repository name (e.g., "Hello-World")
const branch = "main";      // Replace with the branch name (e.g., "main")

let currentBranch = null;

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

async function getFileContentUtil(filePath, reqBranch) {
    console.log("reqbranch:" + reqBranch);
    
    try {
        // Get the file content from the repository
        const fileData = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: filePath,
            ref: reqBranch, // Specify the branch or commit SHA
        });

        // Decode the content from Base64
        const content = Buffer.from(fileData.data.content, 'base64').toString('utf-8');
        console.log(`Content of ${filePath}:`, content);
        return content;
    } catch (error) {
        console.error(`Error fetching content for file ${filePath}:`, error);
        throw error;
    }
}

async function createBranchInRepo(branchName) {
    if (!branchName) {
        throw new Error("Branch name is required.");
    }

    try {
        // Get the latest commit SHA of the main branch
        const mainBranchRef = await octokit.rest.git.getRef({
            owner,
            repo,
            ref: "heads/main",
        });

        const latestCommitSha = mainBranchRef.data.object.sha;

        // Create the new branch
        const newBranchRef = await octokit.rest.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${branchName}`,
            sha: latestCommitSha,
        });

        return {
            message: `Branch '${branchName}' created successfully.`,
            branch: {
                name: branchName,
                sha: latestCommitSha,
            },
        };
    } catch (error) {
        console.error("Error creating branch:", error);
        throw new Error("Failed to create branch.");
    }
}

async function deleteBranchFromRepo(branchName) {
    if (!/^deletable-test-branch.*/.test(branchName)) {
        throw new Error("Branch deletion is not allowed unless it matches the pattern 'deletable-test-branch*'. Please delete the branch manually. This is for safety.");
    }

    try {
        // Delete the branch
        await octokit.rest.git.deleteRef({
            owner,
            repo,
            ref: `heads/${branchName}`,
        });

        return {
            message: `Branch '${branchName}' deleted successfully.`
        };
    } catch (error) {
        console.error("Error deleting branch:", error.response.data.message);
        throw new Error("Failed to delete branch. Error: " + error.response.data.message);
    }
}

async function commitFileToBranch({ filePath, content, commitMessage, branchName }) {
    if (!filePath || !content || !commitMessage || !branchName) {
        throw new Error("All parameters (filePath, content, commitMessage, branchName) are required.");
    }

    try {
        // Get the file's current SHA if it exists
        let fileSha = null;
        try {
            const fileData = await octokit.rest.repos.getContent({
                owner,
                repo,
                path: filePath,
                ref: branchName,
            });
            fileSha = fileData.data.sha; // Existing file SHA
        } catch (error) {
            if (error.status === 404) {
                // File does not exist, proceed without throwing an error
                console.log(`File '${filePath}' does not exist in branch '${branchName}', proceeding to create it.`);
            } else {
                // Log and rethrow other errors
                console.error("Failed to fetch file information:", error.message);
                throw new Error("Failed to fetch file information: " + error.message);
            }
        }

        // Commit the file (create or update)
        const response = await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: commitMessage,
            content: Buffer.from(content).toString("base64"), // Encode content to Base64
            branch: branchName,
            sha: fileSha, // Include SHA if updating an existing file
        });

        return {
            message: `File '${filePath}' committed successfully to branch '${branchName}'.`,
            commit: response.data.commit,
        };
    } catch (error) {
        console.error("Error committing file:", error.message);
        throw new Error("Failed to commit file. Error: " + error.message);
    }
}

async function processFileCommit({ filePath, content, commitMessage }) {
    if (!filePath || !content || !commitMessage) {
        throw new Error("All parameters (filePath, content, commitMessage) are required.");
    }

    try {
        // Extract filename from filePath
        const fileName = filePath.split('/').pop();

        // Get current date and time in IST
        const currentDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).replace(/[:/,\s]/g, "-");

        // Check if the file exists in the main branch
        let fileExists = false;
        try {
            await octokit.rest.repos.getContent({
                owner,
                repo,
                path: filePath,
                ref: branch, // Check in the main branch
            });
            fileExists = true;
        } catch (error) {
            if (error.status !== 404) {
                throw new Error("Failed to check file existence: " + error.message);
            }
        }

        // Determine branch name
        const operation = fileExists ? "UPDATE" : "CREATE";
        const branchName = `${fileName}-${currentDate}-${operation}`;

        // Create a new branch from main
        await createBranchInRepo(branchName);

        // Commit the file to the new branch
        await commitFileToBranch({ filePath, content, commitMessage, branchName });

        // Attempt to merge the branch into main
        try {
            const mergeResponse = await octokit.rest.repos.merge({
                owner,
                repo,
                base: branch, // Main branch
                head: branchName, // Feature branch
                commit_message: `Merge branch '${branchName}' into '${branch}. Automatic merge by Arya's portfolio's backend.'`,
            });

            return {
                message: `Branch '${branchName}' merged successfully into '${branch}'. Automatic merge by Arya's portfolio's backend.`,
                merge: mergeResponse.data,
            };
        } catch (mergeError) {
            if (mergeError.status === 409) {
                // If merge error, create a pull request
                const pullRequest = await octokit.rest.pulls.create({
                    owner,
                    repo,
                    title: `Merge ${branchName} into ${branch}`,
                    head: branchName,
                    base: branch,
                    body: `Automatically created pull request to merge branch '${branchName}' into '${branch}'. PR created automatically by Arya's portfolio's backend.`,
                });

                // Merge the pull request
                await octokit.rest.pulls.merge({
                    owner,
                    repo,
                    pull_number: pullRequest.data.number,
                });

                return {
                    message: `Branch '${branchName}' merged into '${branch}' via pull request. Automatic merge by Arya's portfolio's backend.`,
                    pullRequest: pullRequest.data,
                };
            } else {
                throw new Error("Failed to merge branch: " + mergeError.message);
            }
        }
    } catch (error) {
        console.error("Error processing file commit:", error.message);
        throw new Error("Failed to process file commit. Error: " + error.message);
    }
}

export { listFilesInRepo, 
            getFileContentUtil, 
            createBranchInRepo, 
            deleteBranchFromRepo, 
            commitFileToBranch, 
            processFileCommit 
        };