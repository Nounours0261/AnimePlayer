import "./EpisodeList.css";
import {useParams} from "react-router";
import {playNumberEvent} from "./player/playerEvents.js";
import {useEffect, useRef} from "react";

function EpisodeList({count, watchPageRef}) {
    const {episode} = useParams();
    const episodeAsInt = parseInt(episode);

    function EpisodeButton({epNumber}) {
        const scrollToRef = useRef(null);

        useEffect(() => {
            if (scrollToRef.current != null) {
                scrollToRef.current.scrollIntoView({behavior: "smooth"});
            }
        }, [epNumber]);

        function clickHandler() {
            watchPageRef.current.dispatchEvent(new playNumberEvent(epNumber));
        }

        return (<>
            <button className={"list-entry" + (epNumber === episodeAsInt ? " selected" : "")}
                    onClick={clickHandler}
                    key={epNumber}
                    ref={epNumber === episodeAsInt - 2 ? scrollToRef : null}
            >
                Episode {epNumber}
            </button>
        </>);
    }

    return (<>
        <div className={`episode-list ${count > 6 ? "tall" : "short"}`}
        >
            {[...Array(count).keys()].map((i) => {
                return <EpisodeButton epNumber={i + 1}/>;
            })}
        </div>
    </>);
}

export default EpisodeList;