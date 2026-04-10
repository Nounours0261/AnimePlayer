import {complementInfo, overWriteInfo} from "./infoHelper.js";
import path from "path";
import fs from "node:fs/promises";
import {argv} from 'node:process';

const animeDir = path.join(process.cwd(), "public", "anime");

async function main() {
    const files = await fs.readdir(animeDir);

    let infoFun = complementInfo;
    if (argv.includes("-f")) {
        infoFun = overWriteInfo;
    }

    const list = [];
    for (const file of files) {
        const fullPath = path.join(animeDir, file);
        const fileData = await fs.lstat(fullPath);
        if (fileData.isDirectory()) {
            await infoFun(fullPath);
            list.push(file);
        }
    }

    const indexPath = path.join(animeDir, "index.json");
    const data = {list};
    await fs.writeFile(indexPath, JSON.stringify(data, null, 2));
}

main().then(() => {
    console.log("Gallery updated !");
});