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

    const url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables,
            }),
        };

    return fetch(url, options).then(handleResponse)
        .then(handleData)
        .catch(handleError);

    function handleResponse(response) {
        return response.json().then((json) => {
            return response.ok ? json : Promise.reject(json);
        });
    }

    function handleData(data) {
        return data.data.Media.coverImage.large;
    }

    function handleError(error) {
        console.error(`Failed to get cover for ${title}`);
        console.error(error);
        return null;
    }
}