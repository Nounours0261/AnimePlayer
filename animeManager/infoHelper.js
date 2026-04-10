import fs from "node:fs/promises";
import path from "path";
import {getCoverUrl} from "./aniListApi.js";

async function getInfo(directory, getCover = false) {
    const baseName = path.basename(directory);

    const files = await fs.readdir(directory);
    const mp4Files = files.filter((file) => {
        // Could be better but eh
        const sp = file.split(".");
        return sp[sp.length - 1] === "mp4";
    });

    const title = baseName.replaceAll("_", " ");
    let cover = null;
    if (getCover) {
        cover = await getCoverUrl(title);
    }

    return {
        title, episodes: mp4Files.sort(), cover,
    };
}

export async function overWriteInfo(directory) {
    const infoPath = path.join(directory, "info.json");
    const data = await getInfo(directory, true);

    await fs.writeFile(infoPath, JSON.stringify(data, null, 2));
}

export async function complementInfo(directory) {
    const infoPath = path.join(directory, "info.json");

    try {
        const contents = await fs.readFile(infoPath);
        const asJson = JSON.parse(contents);

        const data = await getInfo(directory, asJson.cover === null);

        data.title = asJson.title ?? data.title;
        data.episodes = asJson.episodes ?? data.episodes;
        data.cover = asJson.cover ?? data.cover;

        await fs.writeFile(infoPath, JSON.stringify(data, null, 2));
    } catch (e) {
        if (e.code !== "ENOENT" && e.name !== "SyntaxError") {
            console.error(`Failed to create info file for '${directory}'`);
            console.error(e);
            return;
        }
        await overWriteInfo(directory);
    }
}