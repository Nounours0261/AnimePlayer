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
                } else {
                    window.alert("Failed to get index contents, check console for more info");
                }
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
            <AnimeRow elements={animeList}
                      oneLine={false}
                      title={"All"}
                      homePageRef={homePageRef}
            />
        </div>
    </>);
}

export default HomePage;