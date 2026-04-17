import {useEffect, useState} from "react";
import {getIndex} from "../utils/jsonReader.js";
import "./HomePage.css";
import AnimeRow from "./AnimeRow.jsx";

function HomePage() {
    const [animeList, setAnimeList] = useState([]);

    // load anime index on creation
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

    const seasonal = JSON.parse(localStorage.getItem("seasonal") ?? "[]");

    const seasonalPaths = animeList.filter((p) => {
        return seasonal.includes(p);
    });

    return (<div id={"anime-list"}
    >
        <AnimeRow paths={seasonalPaths}
                  oneLine={true}
                  title={"Seasonal"}
        />
        <AnimeRow paths={animeList}
                  oneLine={false}
                  title={"All"}
        />
    </div>);
}

export default HomePage;