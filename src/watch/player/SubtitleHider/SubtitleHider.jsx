import {useEffect, useState} from "react";
import "./SubtitleHider.css";
import HiderStar from "./HiderStar.jsx";
import {useParams} from "react-router";

function getHiderPos(title) {
    const animeData = JSON.parse(localStorage.getItem(title) ?? "{}");
    return animeData.hiderPos ?? 6;
}

function storeHiderPos(title, newValue) {
    const animeData = JSON.parse(localStorage.getItem(title) ?? "{}");
    animeData.hiderPos = newValue;
    localStorage.setItem(title, JSON.stringify(animeData));
}

function SubtitleHider() {
    const [showHider, setShowHider] = useState((localStorage.getItem("hide-subtitles") ?? "false") === "true");
    const {anime} = useParams();
    const [hiderPos, setHiderPos] = useState(getHiderPos(anime));

    // keyboard handler for enable/disable
    useEffect(() => {
        function keyHandler(e) {
            if (e.key === "h") {
                setShowHider(!showHider);
                localStorage.setItem("hide-subtitles", `${!showHider}`);
            }

            if (e.key === "ArrowUp") {
                const newValue = hiderPos + 1;
                setHiderPos(newValue);
                storeHiderPos(anime, newValue);
            }

            if (e.key === "ArrowDown") {
                const newValue = hiderPos - 1;
                setHiderPos(newValue);
                storeHiderPos(anime, newValue);
            }
        }

        window.addEventListener("keydown", keyHandler);

        return () => {
            window.removeEventListener("keydown", keyHandler);
        };
    }, [showHider, hiderPos, anime]);

    return (<>
        <div id={"subtitle-hider"}
             className={showHider ? "shown" : "hidden"}
             style={{bottom: `${hiderPos}%`}}
        >
            <HiderStar leftPercent={-2} topPercent={-15}/>
            <HiderStar leftPercent={12} topPercent={40}/>
            <HiderStar leftPercent={31} topPercent={10}/>
            <HiderStar leftPercent={50} topPercent={-30}/>
            <HiderStar leftPercent={60} topPercent={45}/>
            <HiderStar leftPercent={77} topPercent={0}/>
            <HiderStar leftPercent={92} topPercent={40}/>
        </div>
    </>);
}

export default SubtitleHider;