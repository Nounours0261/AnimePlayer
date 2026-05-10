import {useEffect, useState} from "react";
import "./SubtitleHider.css";
import HiderStar from "./HiderStar.jsx";

function SubtitleHider() {
    const [showHider, setShowHider] = useState((localStorage.getItem("hide-subtitles") ?? "false") === "true");

    // keyboard handler for enable/disable
    useEffect(() => {
        function keyHandler(e) {
            if (e.key === "h") {
                setShowHider(!showHider);
                localStorage.setItem("hide-subtitles", `${!showHider}`);
            }
        }

        window.addEventListener("keydown", keyHandler);

        return () => {
            window.removeEventListener("keydown", keyHandler);
        };
    }, [showHider]);

    return (<>
        <div id={"subtitle-hider"}
             className={showHider ? "shown" : "hidden"}
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