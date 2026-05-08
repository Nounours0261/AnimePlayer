import Player from "./player/Player.jsx";
import {useNavigate, useParams} from "react-router";
import {useCallback, useEffect, useRef, useState} from "react";
import EpisodeList from "./EpisodeList.jsx";
import {getIndex} from "../utils/jsonReader.js";
import {almostFinishedEvent, playNextEvent, playNumberEvent} from "./player/playerEvents.js";
import "./WatchPage.css";
import Error from "../app/Error.jsx";
import DefaultCover from "../utils/DefaultCover.jsx";

function WatchPage() {
    const [animeInfo, setAnimeInfo] = useState({});
    const [link, setLink] = useState(null);
    const {anime, episode} = useParams();
    const navigate = useNavigate();
    const watchPageRef = useRef(null);
    const [coverSource, setCoverSource] = useState(null);
    const [error, setError] = useState(null);

    const episodeAsInt = parseInt(episode);

    const changeEpisode = useCallback((number) => {
        navigate(`/watch/${anime}/${number}`);
    }, [anime, navigate]);

    // load data on display
    useEffect(() => {
        let ignore = false;
        getIndex().then((index) => {
            if (!ignore) {
                function goHome() {
                    navigate("/home");
                }

                const homeButton = (
                    <button onClick={goHome}
                            className={"dark"}
                    >
                        Go home
                    </button>
                );

                function restart() {
                    navigate(`/watch/${anime}/1`);
                }

                const restartButton = (
                    <button onClick={restart}
                            className={"light"}
                    >
                        Start over
                    </button>
                );

                if (index === null) {
                    setError(<Error message={"Could not access index contents."}>
                        {homeButton}
                    </Error>);
                    return;
                }

                const info = index.list.find((e) => {
                    return e.path === anime;
                });

                if (info === undefined) {
                    setError(<Error message={`Could not find '${anime}' in the index.`}>
                        {homeButton}
                    </Error>);
                    return;
                }

                setAnimeInfo(info);
                setCoverSource(info.cover ?? null);

                if (isNaN(episodeAsInt)) {
                    setError(<Error message={`Could not open episode '${episode}' : not a number.`}>
                        {homeButton}
                        {restartButton}
                    </Error>);
                    return;
                }

                if (info.episodes === undefined) {
                    setError(<Error message={`Anime '${episode}' does not have any episodes.`}>
                        {homeButton}
                    </Error>);
                    return;
                }

                if (episodeAsInt > info.episodes.length) {
                    setError(<Error
                        message={`Could not open episode ${episode} : anime '${info.title}' only has ${info.episodes.length} episodes.`}>
                        {homeButton}
                        {restartButton}
                    </Error>);
                    return;
                }

                if (episodeAsInt <= 0) {
                    setError(<Error message={`Could not open episode ${episode} : episode numbers start at 1.`}>
                        {homeButton}
                        {restartButton}
                    </Error>);
                    return;
                }

                setLink(`/anime/${anime}/${info.episodes[episodeAsInt - 1]}`);
                setError(null);

                // update anime browser storage
                // next episode
                const browserAnimeData = JSON.parse(localStorage.getItem(anime) ?? "{}");
                browserAnimeData.nextEp = episodeAsInt;
                localStorage.setItem(anime, JSON.stringify(browserAnimeData));

                // latest anime list
                const browserLatestData = JSON.parse(localStorage.getItem("latest") ?? "[]");
                const newList = browserLatestData.filter((p) => {
                    return p !== anime;
                });
                newList.unshift(anime);
                if (newList.length > 7) {
                    newList.pop();
                }
                localStorage.setItem("latest", JSON.stringify(newList));
            }
        });
        return () => {
            ignore = true;
        };
    }, [anime, episodeAsInt, episode, navigate]);

    // keyboard handler for changing episodes
    useEffect(() => {
        if (isNaN(episodeAsInt)) {
            return;
        }

        function keyHandler(e) {
            if (e.key === "d") {
                changeEpisode(episodeAsInt - 1);
            }
            if (e.key === "g") {
                changeEpisode(episodeAsInt + 1);
            }
        }

        window.addEventListener("keydown", keyHandler);

        return () => {
            window.removeEventListener("keydown", keyHandler);
        };
    }, [changeEpisode, episodeAsInt]);

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

    function coverErrorHandler() {
        setCoverSource(null);
    }

    return (<>
        <div id={"watch-page"}
             ref={watchPageRef}>
            <EpisodeList count={(animeInfo.episodes ?? []).length}
                         watchPageRef={watchPageRef}
            />
            <div id={"player-holder"}
            >
                <Player videoLink={link}
                        watchPageRef={watchPageRef}
                        error={error}
                        title={`${animeInfo.title} - ${episodeAsInt}`}
                />
            </div>
            <div id={"anime-info"}
            >
                {
                    coverSource === null
                        ? <DefaultCover/>
                        : <img src={coverSource}
                               alt={"anime cover"}
                               id={"side-cover"}
                               onError={coverErrorHandler}
                        />
                }
                {animeInfo.title}
            </div>
        </div>
    </>);
}

export default WatchPage;