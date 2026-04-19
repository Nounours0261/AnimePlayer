import {useEffect, useRef, useState} from "react";
import {getIndex} from "../utils/jsonReader.js";
import "./HomePage.css";
import AnimeRow from "./AnimeRow.jsx";
import {listUpdateEvent} from "./HomeEvents.js";

function HomePage() {
    const [animeList, setAnimeList] = useState([]);
    const homePageRef = useRef(null);
    const [seasonal, setSeasonal] = useState([]);

    const [latest, setLatest] = useState([]);

    // load anime index on creation
    useEffect(() => {
        let ignore = false;
        getIndex().then((index) => {
            if (!ignore) {
                if (index.ok) {
                    setAnimeList(index.list);

                    setLatest(JSON.parse(localStorage.getItem("latest") ?? "[]").filter((p) => {
                        return index.list.includes(p);
                    }));

                    setSeasonal(JSON.parse(localStorage.getItem("seasonal") ?? "[]").filter((p) => {
                        return index.list.includes(p);
                    }));
                } else {
                    window.alert("Failed to get index contents, check console for more info");
                }
            }
        });
        return () => {
            ignore = true;
        };
    }, []);


    useEffect(() => {
        const curPage = homePageRef.current;

        function listUpdateHandler() {
            setSeasonal(JSON.parse(localStorage.getItem("seasonal") ?? "[]").filter((p) => {
                return animeList.includes(p);
            }));
        }

        curPage.addEventListener(listUpdateEvent.name, listUpdateHandler);

        return () => {
            curPage.removeEventListener(listUpdateEvent.name, listUpdateHandler);
        };

    }, [animeList]);

    return (<>
        <div id={"home-page"}
             ref={homePageRef}
        >
            <AnimeRow paths={latest}
                      oneLine={true}
                      title={"Latest"}
                      homePageRef={homePageRef}
            />
            <AnimeRow paths={seasonal}
                      oneLine={true}
                      title={"Seasonal"}
                      homePageRef={homePageRef}
            />
            <AnimeRow paths={animeList}
                      oneLine={false}
                      title={"All"}
                      homePageRef={homePageRef}
            />
        </div>
    </>);
}

export default HomePage;