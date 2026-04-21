import path from "path";
import "./consoleHelpers.js";
import fs from "node:fs/promises";
import readline from 'readline';

// Check that path exists and is a directory
async function checkDirectory(input) {
    try {
        let sanitized = input.trim();
        if (sanitized[0] === '~') {
            sanitized = path.join(process.env.HOME, sanitized.slice(1));
        }
        sanitized = path.resolve(sanitized);
        const stat = await fs.lstat(sanitized);
        if (stat.isDirectory()) {
            return sanitized;
        }
        return null;
    } catch {
        return null;
    }
}

// Ask the user for their download directory
async function promptDownloadDirectory() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let answer = await new Promise(resolve => {
        rl.question("What is your download directory ? I will look for anime in [directory]/anime/*.\n", resolve);
    });

    while (await checkDirectory(answer) === null) {
        answer = await new Promise(resolve => {
            rl.question(`'${answer}' could not be found, or isn't a directory. Please try another directory.\n`, resolve);
        });
    }

    const downloadDirectory = await checkDirectory(answer);

    const shouldSave = await new Promise(resolve => {
        rl.question(`Do you want to save '${downloadDirectory}' as the default ? (yes/no)\n`, resolve);
    });
    rl.close();

    if (["yes", "y"].includes(shouldSave)) {
        await fs.writeFile(configPath, JSON.stringify({downloadDirectory}, null, 2));
    }

    return downloadDirectory;
}

const configPath = path.join(process.cwd(), "animeManager", "config.json");
const publicAnimeDirectory = path.join(process.cwd(), "public", "anime");

// Check and move any anime downloads
export async function moveDownloads() {
    let downloadDirectory;
    try {
        const contents = await fs.readFile(configPath);
        const oldData = JSON.parse(contents);
        downloadDirectory = oldData.downloadDirectory;
        if (typeof downloadDirectory !== "string") {
            downloadDirectory = await promptDownloadDirectory();
        }
    } catch {
        downloadDirectory = await promptDownloadDirectory();
    }

    console.blue(`Checking for new downloads in ${downloadDirectory}`);

    const downloadAnimeDirectory = path.join(downloadDirectory, "anime");
    if (await checkDirectory(downloadAnimeDirectory) === null) {
        console.warn("Could not find an anime directory in your downloads");
        return;
    }

    const contents = await fs.readdir(downloadAnimeDirectory);
    for (const f of contents) {
        const downloadName = path.join(downloadAnimeDirectory, f);
        try {
            const stat = await fs.lstat(downloadName);
            if (!stat.isDirectory()) {
                continue;
            }
        } catch {
            continue;
        }

        const publicName = path.join(publicAnimeDirectory, f);
        let exists = true;
        try {
            await fs.lstat(publicName);
        } catch {
            exists = false;
        }

        if (!exists) {
            console.log(`Moving new anime '${f}' to public directory !`);
            await fs.mkdir(publicName);
            const files = await fs.readdir(downloadName);
            for (const file of files) {
                await fs.rename(path.join(downloadName, file), path.join(publicName, file));
            }
            await fs.rmdir(downloadName);
            console.log(`Moved all ${files.length} episodes of '${f}' and deleted download directory`);
        }

        if (exists) {
            console.log(`Moving new episodes of '${f}' to public directory !`);
            const files = await fs.readdir(downloadName);
            for (const file of files) {
                await fs.rename(path.join(downloadName, file), path.join(publicName, file));
            }
            await fs.rmdir(downloadName);
            console.log(`Added ${files.length} episodes to '${f}' and deleted download directory`);
        }
    }

    console.cyan(`Finished checking for new downloads`);
}