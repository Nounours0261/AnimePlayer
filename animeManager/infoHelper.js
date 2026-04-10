import fs from "node:fs/promises";
import path from "path";

async function getInfo(directory) {
    const baseName = path.basename(directory);

    const files = await fs.readdir(directory);
    const mp4Files = files.filter((file) => {
        // Could be better but eh
        const sp = file.split(".");
        return sp[sp.length - 1] === "mp4";
    });

    return {
        title: baseName.replaceAll("_", " "), episodes: mp4Files.sort(),
    };
}

export async function overWriteInfo(directory) {
    const infoPath = path.join(directory, "info.json");
    const data = await getInfo(directory);

    await fs.writeFile(infoPath, JSON.stringify(data, null, 2));
}

export async function complementInfo(directory) {
    const infoPath = path.join(directory, "info.json");
    const data = await getInfo(directory);

    try {
        const contents = await fs.readFile(infoPath);
        const asJson = JSON.parse(contents);

        data.title = asJson.title ?? data.title;
        data.episodes = asJson.episodes ?? data.episodes;
    } catch (e) {
        if (e.code !== "ENOENT" && e.name !== "SyntaxError") {
            console.error(e);
        }
    }

    await fs.writeFile(infoPath, JSON.stringify(data, null, 2));
}