import "./EpisodeList.css";
import {useParams} from "react-router";
import {playNumberEvent} from "./player/playerEvents.js";
import {useEffect, useRef} from "react";

function EpisodeList({count, watchPageRef}) {
    const {episode} = useParams();
    const scrollToRef = useRef(null);
    const episodeAsInt = parseInt(episode);

    useEffect(() => {
        if (scrollToRef.current != null) {
            scrollToRef.current.scrollIntoView();
        }
    }, [count, watchPageRef]);

    function EpisodeButton(i, scrollTo = false) {
        function clickHandler() {
            watchPageRef.current.dispatchEvent(new playNumberEvent(i));
        }

        return (<>
            <button className={"list-entry" + (i === episodeAsInt ? " selected" : "")}
                    onClick={clickHandler}
                    key={i}
                    ref={scrollTo ? scrollToRef : null}
            >
                Episode {i}
            </button>
        </>);
    }

    const allEpisodes = [...Array(count).keys()];

    return (<>
        <div className={`episode-list ${count > 6 ? "tall" : "short"}`}
        >
            {allEpisodes.slice(0, episodeAsInt - 3).map((i) => {
                return EpisodeButton(i + 1);
            })}
            {episodeAsInt - 2 > 0 && episodeAsInt - 2 <= count ? EpisodeButton(episodeAsInt - 2, true) : null}
            {allEpisodes.slice(episodeAsInt - 2).map((i) => {
                return EpisodeButton(i + 1);
            })}
        </div>
    </>);
}

export default EpisodeList;