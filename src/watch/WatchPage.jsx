import Player from "./player/Player.jsx";
import {NavLink, useNavigate, useParams} from "react-router";
import {useCallback, useEffect, useRef, useState} from "react";
import EpisodeList from "./EpisodeList.jsx";
import {getAnimeInfo} from "../utils/jsonReader.js";
import {almostFinishedEvent, playNextEvent, playNumberEvent} from "./player/playerEvents.js";

function WatchPage() {
    const [animeInfo, setAnimeInfo] = useState({});
    const [link, setLink] = useState(null);
    const {anime, episode} = useParams();
    const navigate = useNavigate();
    const watchPageRef = useRef(null);

    const changeEpisode = useCallback((number) => {
        if (number > animeInfo.episodes.length) {
            console.warn(`This anime has less than ${number} episodes`);
            return;
        }

        if (number < 1) {
            console.warn(`Episode numbers start at 1, cannot access episode ${number}`);
            return;
        }

        navigate(`/watch/${anime}/${number}`);
        setLink(`/anime/${anime}/${((animeInfo.episodes ?? [])[number - 1] ?? "")}`);
    }, [anime, animeInfo.episodes, navigate]);

    // load data on display
    useEffect(() => {
        let ignore = false;
        getAnimeInfo(anime).then((info) => {
            if (!ignore) {
                if (info.ok) {
                    setAnimeInfo(info);
                    setLink(`/anime/${anime}/${((info.episodes ?? [])[episode - 1] ?? "")}`);
                } else {
                    window.alert(`Failed to get info about '${anime}', check console for more info`);
                }
            }
        });
        return () => {
            ignore = true;
        };
    }, []);

    // update browser storage
    useEffect(() => {
        const browserAnimeData = JSON.parse(localStorage.getItem(anime) ?? "{}");
        browserAnimeData.nextEp = parseInt(episode);
        localStorage.setItem(anime, JSON.stringify(browserAnimeData));

        const browserLatestData = JSON.parse(localStorage.getItem("latest") ?? "[]");
        const newList = browserLatestData.filter((p) => {
            return p !== anime;
        });
        newList.unshift(anime);
        if (newList.length > 5) {
            newList.pop();
        }
        localStorage.setItem("latest", JSON.stringify(newList));

    }, [anime, episode]);

    // keyboard handler for changing episodes
    useEffect(() => {
        function keyHandler(e) {
            if (e.key === "d") {
                changeEpisode(parseInt(episode) - 1);
            }
            if (e.key === "g") {
                changeEpisode(parseInt(episode) + 1);
            }
        }

        window.addEventListener("keydown", keyHandler);

        return () => {
            window.removeEventListener("keydown", keyHandler);
        };
    }, [anime, animeInfo, changeEpisode, episode, navigate]);

    // event handlers for children
    useEffect(() => {
        const curPage = watchPageRef.current;

        function playNextHandler() {
            changeEpisode(parseInt(episode) + 1);
        }

        function playNumberHandler(e) {
            changeEpisode(e.detail);
        }

        function almostFinishedHandler() {
            const browserAnimeData = JSON.parse(localStorage.getItem(anime) ?? "{}");
            browserAnimeData.nextEp = parseInt(episode) + 1;
            localStorage.setItem(anime, JSON.stringify(browserAnimeData));
        }

        curPage.addEventListener(playNextEvent.name, playNextHandler);
        curPage.addEventListener(playNumberEvent.name, playNumberHandler);
        curPage.addEventListener(almostFinishedEvent.name, almostFinishedHandler);

        return () => {
            curPage.removeEventListener(playNextEvent.name, playNextHandler);
            curPage.removeEventListener(playNumberEvent.name, playNumberHandler);
            curPage.removeEventListener(almostFinishedEvent.name, almostFinishedHandler);
        };
    }, [anime, changeEpisode, episode]);

    return (<>
        <div id={"container"}
             ref={watchPageRef}>
            <EpisodeList count={(animeInfo.episodes ?? []).length}
                         watchPageRef={watchPageRef}
            />

            <Player videoLink={link}
                    watchPageRef={watchPageRef}
            />

            <div>
                {anime}, {episode}
            </div>
            <NavLink to={"/home"}
            >
                Home
            </NavLink>
        </div>
    </>);
}

export default WatchPage;