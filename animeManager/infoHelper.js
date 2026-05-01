import fs from "node:fs/promises";
import path from "path";
import {getCoverUrl} from "./aniListApi.js";

// Create an info object with directory data
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
        title, episodes: mp4Files.sort(), cover, path: baseName,
    };
}

// Keep old data unless it is missing elements
export async function complementInfo(directory, oldData) {
    const calcData = await getInfo(directory, oldData.cover === null || oldData.cover === undefined);
    const missingEpisodes = calcData.episodes.filter((episode) => {
        return !((oldData.episodes ?? []).includes(episode));
    });

    const newData = {};
    newData.title = oldData.title ?? calcData.title;
    newData.episodes = oldData.episodes ?? [];
    newData.episodes.push(...missingEpisodes);
    newData.episodes.sort();
    newData.cover = oldData.cover ?? calcData.cover;
    newData.path = calcData.path;

    if (missingEpisodes.length !== 0) {
        console.log(`Added ${missingEpisodes.length} episode${missingEpisodes.length > 1 ? "s" : ""} to '${newData.title}'`);
    }

    return newData;
}