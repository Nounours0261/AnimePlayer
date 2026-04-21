// fetch cover URL from AniList with error handling and 429 checking
export async function getCoverUrl(title) {
    const query = `
query ($title: String) {
  Media (search: $title, type: ANIME, sort: SEARCH_MATCH) { 
    coverImage {
        large
    }
  }
}
`;

    const variables = {
        title,
    };

    const url = 'https://graphql.anilist.co', options = {
        method: 'POST', headers: {
            'Content-Type': 'application/json', 'Accept': 'application/json',
        }, body: JSON.stringify({
            query, variables,
        }),
    };

    console.log(`Fetching cover for '${title}'`);
    const res = await fetch(url, options);
    if (res.ok) {
        try {
            const json = await res.json();
            return json.data.Media.coverImage.large;
        } catch (e) {
            console.error(`Ran into error '${e}' while fetching cover for '${title}'`);
            return null;
        }
    }
    if (res.status === 429) {
        const timeToWait = parseInt(res.headers.get("retry-after")) + 3;
        console.warn(`Received TooManyRequests from AniList API, trying again in ${timeToWait} seconds`);
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWait * 1000);
        });
        return getCoverUrl(title);
    }
    console.error(`Received code ${res.status} (${res.statusText}) while fetching cover for '${title}'`);
    return null;
}