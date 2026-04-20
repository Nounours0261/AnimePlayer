import "./EpisodeList.css";
import {useParams} from "react-router";
import {playNumberEvent} from "./player/playerEvents.js";

function EpisodeList({count, watchPageRef}) {
    const {episode} = useParams();

    function makeItem(i) {
        function clickHandler() {
            watchPageRef.current.dispatchEvent(new playNumberEvent(i));
        }

        return (
            <button className={"list-entry" + (i === parseInt(episode) ? " selected" : "")}
                    onClick={clickHandler}
                    key={i}
            >
                Episode {i}
            </button>
        );
    }

    return (<>
            <div className={`episode-list ${count > 6 ? "tall" : "short"}`}
            >
                {
                    [...Array(count).keys()].map((i) => {
                        return makeItem(i + 1);
                    })
                }
            </div>
        </>
    );
}

export default EpisodeList;