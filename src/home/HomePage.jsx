import {useEffect, useState} from "react";
import AnimeEntry from "./AnimeEntry.jsx";
import {getIndex} from "../utils/jsonReader.js";
import "./HomePage.css";

function HomePage() {
    const [animeList, setAnimeList] = useState([]);

    useEffect(() => {
        let ignore = false;
        getIndex().then((index) => {
            if (!ignore) {
                if (index.ok) {
                    setAnimeList(index.list);
                } else {
                    window.alert("Failed to get index contents, check console for more info");
                }
            }
        });
        return () => {
            ignore = true;
        };
    }, []);

    return (<div id={"anime-list"}>
        {
            animeList.map((anime, index) => {
                return <AnimeEntry path={anime}
                                   key={index}
                >
                    {anime}
                </AnimeEntry>;
            })
        }
    </div>);
}

export default HomePage;