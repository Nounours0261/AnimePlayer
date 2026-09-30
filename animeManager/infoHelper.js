import fs from "node:fs/promises";
import path from "path";
import {getCoverUrl} from "./aniListApi.js";
import {animeDirectory} from "./main.js";

async function downloadImage (url, path){
    const response = await fetch(url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(path, buffer);
}

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
        cover = await getCoverUrl(baseName, title);
        if (cover !== null)  {
            const split = cover.split(".");
            const coverPath = `cover.${split[split.length - 1]}`;
            await downloadImage(cover, path.join(directory, coverPath))
            cover = coverPath;
        }
    }

    return {
        title, episodes: mp4Files.sort(), cover, path: baseName,
    };
}

// Keep old data unless it is missing elements
export async function complementInfo(directory, oldData) {
    const calcData = await getInfo(directory, oldData.cover === null || oldData.cover === undefined);

    const newData = {};
    newData.title = oldData.title ?? calcData.title;
    newData.episodes = calcData.episodes.sort();
    newData.cover = oldData.cover ?? calcData.cover;
    newData.path = calcData.path;

    const diff = newData.episodes.length - (oldData.episodes ?? []).length;
    if (diff > 0) {
        console.log(`Added ${diff} episode${diff > 1 ? "s" : ""} to '${newData.title}'`);
    }
    if (diff < 0 ) {
        console.log(`Removed ${-diff} episode${diff < -1 ? "s" : ""} from '${newData.title}'`);
    }
    if (newData.episodes.length === 0) {
        console.magenta(`Deleting entry for '${newData.title}'`);
        return null;
    }

    return newData;
}

export async function forceCover(animePath, coverUrl) {
    const indexPath = path.join(animeDirectory, "index.json");
    let indexContents;
    try {
        const raw = await fs.readFile(indexPath);
        const json = await JSON.parse(raw);
        indexContents = json.list;
    } catch {
        console.error("Failed to read index");
        return;
    }

   for (let entry of indexContents) {
       if (entry.path === animePath) {
           const split = coverUrl.split(".");
           const coverPath = `cover.${split[split.length - 1]}`;
           await downloadImage(coverUrl, path.join(animeDirectory, entry.path, coverPath))
           entry.cover = coverPath;

           await fs.writeFile(indexPath, JSON.stringify({list: indexContents}, null, 2));
           return;
       }
   }

   console.error(`Could not find ${animePath} in the index`)
}