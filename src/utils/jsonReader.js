async function getJsonFile(path) {
    try {
        const fileResponse = await fetch(path);
        if (!fileResponse.ok) {
            console.error(fileResponse.statusText);
            return {ok: false};
        }
        const fileContents = await fileResponse.json();
        fileContents.ok = true;
        return fileContents;
    } catch (e) {
        console.error(e);
        return {ok: false};
    }
}

export async function getAnimeInfo(path) {
    return getJsonFile(`/anime/${path}/info.json`);
}

export async function getIndex() {
    return getJsonFile("/anime/index.json");
}