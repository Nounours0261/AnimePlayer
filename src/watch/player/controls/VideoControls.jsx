import PlayPauseButton from "./PlayPauseButton.jsx";
import FullscreenButton from "./FullscreenButton.jsx";
import {useEffect, useRef, useState} from "react";
import ProgressBar from "./ProgressBar.jsx";
import "./VideoControls.css";
import VolumeBar from "./VolumeBar.jsx";
import SkipRewind from "./SkipRewind.jsx";

function VideoControls({videoRef, playerRef, title}) {
    const controlsRef = useRef(null);
    const titleRef = useRef(null);
    const hideTimeout = useRef(0);
    const [shown, setShown] = useState(false);

    function showControls() {
        setShown(true);

        if (hideTimeout.current !== 0) {
            clearTimeout(hideTimeout.current);
        }

        if (!controlsRef.current.matches(":hover") && !titleRef.current.matches(":hover")) {
            hideTimeout.current = setTimeout(() => {
                setShown(false);
                hideTimeout.current = 0;
            }, 1000);
        }
    }

    // move event listener for hiding controls
    useEffect(() => {
        window.addEventListener("mousemove", showControls);

        return () => {
            window.removeEventListener("mousemove", showControls);
            if (hideTimeout.current !== 0) {
                clearTimeout(hideTimeout.current);
            }
        };
    }, []);

    return (<>
        <div id={"video-title"}
             ref={titleRef}
             className={shown ? "shown" : "hidden"}
        >
            {title}
        </div>
        <div id="video-controls"
             ref={controlsRef}
             className={shown ? "shown" : "hidden"}
        >
            <PlayPauseButton videoRef={videoRef}
            />

            <ProgressBar videoRef={videoRef}
            />

            <VolumeBar videoRef={videoRef}
            />

            <SkipRewind videoRef={videoRef}
                        showControls={showControls}
            />

            <FullscreenButton playerRef={playerRef}
            />
        </div>
    </>);
}

export default VideoControls;
