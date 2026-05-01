import {complementInfo} from "./infoHelper.js";
import path from "path";
import fs from "node:fs/promises";
import {argv} from 'node:process';
import "./consoleHelpers.js";
import {moveDownloads} from "./moveDownloads.js";

const animeDirectory = path.join(process.cwd(), "public", "anime");

async function main() {
    if (argv.includes("-u")) {
        console.green("update option was used, downloads will be checked");
        await moveDownloads();
    }

    console.blue("Updating index");

    const indexPath = path.join(animeDirectory, "index.json");
    let indexContents;
    try {
        const raw = await fs.readFile(indexPath);
        const json = await JSON.parse(raw);
        indexContents = json.list;
    } catch {
        indexContents = [];
    }

    const files = await fs.readdir(animeDirectory);
    const list = [];
    for (const file of files) {
        const fullPath = path.join(animeDirectory, file);
        const fileData = await fs.lstat(fullPath);
        if (fileData.isDirectory()) {
            const existingData = indexContents.find((e) => {
                return e.path === file;
            }) ?? {};
            list.push(await complementInfo(fullPath, existingData));
        }
    }

    await fs.writeFile(indexPath, JSON.stringify({list}, null, 2));
}

main().then(() => {
    console.cyan("Index updated !");
});