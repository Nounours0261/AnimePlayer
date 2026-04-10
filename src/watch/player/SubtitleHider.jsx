import {useEffect, useState} from "react";
import "./SubtitleHider.css";

function SubtitleHider() {
    const [hidden, setHidden] = useState(!!(localStorage.getItem("hide-subtitles") ?? false));

    useEffect(() => {
        function keyHandler(e) {
            if (e.key === "h") {
                setHidden(!hidden);
                localStorage.setItem("hide-subtitles", !hidden);
            }
        }

        window.addEventListener("keydown", keyHandler);

        return () => {
            window.removeEventListener("keydown", keyHandler);
        };
    }, [hidden]);

    return (
        <div id={"subtitle-hider"}
             className={hidden ? "hidden" : "shown"}
        >

        </div>
    );
}

export default SubtitleHider;