async function getJsonFile(path) {
    try {
        const fileResponse = await fetch(path);
        if (!fileResponse.ok) {
            console.error(`Failed to fetch '${path}'`, fileResponse.statusText);
            return null;
        }
        return await fileResponse.json();
    } catch (e) {
        console.error(`Failed to fetch '${path}'`, e);
        return null;
    }
}

let cachedIndex = null;
let cachedIndexTime = null;

export async function getIndex() {
    if (cachedIndexTime === null || cachedIndex === null || cachedIndexTime + 10 * 60 * 60 > Date.now()) {
        const contents = await getJsonFile("/anime/index.json");
        cachedIndex = contents;
        cachedIndexTime = Date.now();
        return contents;
    }
    return cachedIndex;
}