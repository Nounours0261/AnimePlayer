import {useEffect, useState} from "react";
import "./SubtitleHider.css";

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
        ></div>
    </>);
}

export default SubtitleHider;