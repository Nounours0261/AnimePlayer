import path from "path";
import "./consoleHelpers.js";
import fs from "node:fs/promises";
import readline from 'readline';

async function checkPath(input) {
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

async function promptDownloadFolder() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let answer = await new Promise(resolve => {
        rl.question("What is your download folder ? I will look for anime in [folder]/anime/*.\n", resolve);
    });

    while (await checkPath(answer) === null) {
        answer = await new Promise(resolve => {
            rl.question(`'${answer}' could not be found, or isn't a directory. Please try another folder.\n`, resolve);
        });
    }

    const downloadFolder = await checkPath(answer);

    const shouldSave = await new Promise(resolve => {
        rl.question(`Do you want to save '${downloadFolder}' as the default ? (yes/no)\n`, resolve);
    });
    rl.close();

    if (["yes", "y"].includes(shouldSave)) {
        await fs.writeFile(configPath, JSON.stringify({downloadFolder}, null, 2));
    }

    return downloadFolder;
}


const configPath = path.join(process.cwd(), "animeManager", "config.json");
const animeDir = path.join(process.cwd(), "public", "anime");

export async function moveDownloads() {
    let downloadFolder;
    try {
        const contents = await fs.readFile(configPath);
        const oldData = JSON.parse(contents);
        downloadFolder = oldData.downloadFolder;
        if (typeof downloadFolder !== "string") {
            downloadFolder = await promptDownloadFolder();
        }
    } catch {
        downloadFolder = await promptDownloadFolder();
    }

    console.blue(`Checking for new downloads in ${downloadFolder}`);

    const animeFolder = path.join(downloadFolder, "anime");
    if (await checkPath(animeFolder) === null) {
        console.warn("Could not find an anime folder in your downloads");
        return;
    }

    const contents = await fs.readdir(animeFolder);
    for (const f of contents) {
        const downloadName = path.join(animeFolder, f);
        try {
            const stat = await fs.lstat(downloadName);
            if (!stat.isDirectory()) {
                continue;
            }
        } catch {
            continue;
        }

        const publicName = path.join(animeDir, f);
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