import {useEffect, useState} from "react";
import AnimeEntry from "./AnimeEntry.jsx";

function HomePage() {
    async function listAnime() {
        const index = await fetch("/anime/index.json");
        const asJson = await index.json();
        return asJson.list;
    }

    const [animeList, setAnimeList] = useState([]);

    useEffect(() => {
        let ignore = false;
        listAnime().then((list) => {
            if (!ignore) {
                setAnimeList(list);
            }
        });
        return () => {
            ignore = true;
        }
    }, []);

    return (<div>
        {
            animeList.map((anime, index) => {
                return <AnimeEntry path={anime} key={index}>{anime}</AnimeEntry>;
            })
        }
    </div>);
}

export default HomePage;