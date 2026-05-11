import {useEffect, useRef, useState} from "react";
import {getIndex} from "../utils/jsonReader.js";
import "./HomePage.css";
import AnimeRow from "./AnimeRow.jsx";
import {listUpdateEvent} from "./HomeEvents.js";
import Error from "../app/Error.jsx";

function HomePage() {
    const [animeList, setAnimeList] = useState([]);
    const homePageRef = useRef(null);
    const [seasonal, setSeasonal] = useState([]);
    const [latest, setLatest] = useState([]);
    const [error, setError] = useState(null);
    const [loaded, setLoaded] = useState(false);

    // load anime index on display
    useEffect(() => {
        let ignore = false;
        getIndex().then((index) => {
            if (!ignore) {
                setLoaded(true);

                if (index === null) {
                    setError(<Error message={"Could not access index contents."}/>);
                    return;
                }

                setAnimeList(index.list);

                setLatest(JSON.parse(localStorage.getItem("latest") ?? "[]").map((p) => {
                    return index.list.find((e) => {
                        return e.path === p;
                    });
                }).filter((e) => {
                    return e !== undefined;
                }));

                setSeasonal(JSON.parse(localStorage.getItem("seasonal") ?? "[]").map((p) => {
                    return index.list.find((e) => {
                        return e.path === p;
                    });
                }).filter((e) => {
                    return e !== undefined;
                }));
            }
        });
        return () => {
            ignore = true;
        };
    }, []);

    // Add listener for list data updates
    useEffect(() => {
        const curPage = homePageRef.current;

        function listUpdateHandler() {
            setSeasonal(JSON.parse(localStorage.getItem("seasonal") ?? "[]").map((p) => {
                return animeList.find((e) => {
                    return e.path === p;
                });
            }).filter((e) => {
                return e !== undefined;
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
            {error}
            {latest.length !== 0 ? <AnimeRow elements={latest}
                                             oneLine={true}
                                             title={"Latest"}
                                             homePageRef={homePageRef}
            /> : null}
            {seasonal.length !== 0 ? <AnimeRow elements={seasonal}
                                               oneLine={true}
                                               title={"Seasonal"}
                                               homePageRef={homePageRef}
            /> : null}
            {loaded ? <AnimeRow elements={animeList}
                                                oneLine={false}
                                                title={"All"}
                                                homePageRef={homePageRef}
            /> : null}
        </div>
    </>);
}

export default HomePage;