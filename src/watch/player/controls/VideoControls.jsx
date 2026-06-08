import PlayPauseButton from "./PlayPauseButton.jsx";
import FullscreenButton from "./FullscreenButton.jsx";
import {useEffect, useRef, useState} from "react";
import ProgressBar from "./ProgressBar.jsx";
import "./VideoControls.css";
import VolumeBar from "./VolumeBar.jsx";
import SkipRewind from "./SkipRewind.jsx";

function VideoControls({videoRef, playerRef, title, videoLink}) {
    const controlsRef = useRef(null);
    const titleRef = useRef(null);
    const [titleShown, setTitleShown] = useState(false);
    const hideTitleTimeout = useRef(0);
    const hideTimeout = useRef(0);
    const [shown, setShown] = useState(false);

    function showControls() {
        setShown(true);

        if (hideTimeout.current !== 0) {
            clearTimeout(hideTimeout.current);
        }

        hideTimeout.current = setTimeout(() => {
            if (!controlsRef.current.matches(":hover") && !titleRef.current.matches(":hover")) {
                setShown(false);
                hideTimeout.current = 0;
            }
        }, 1000);
    }

    // move event listener for hiding controls
    useEffect(() => {
        const curPlayer = playerRef.current;

        curPlayer.addEventListener("mousemove", showControls);

        return () => {
            curPlayer.removeEventListener("mousemove", showControls);
            if (hideTimeout.current !== 0) {
                clearTimeout(hideTimeout.current);
            }
        };
    }, [playerRef]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTitleShown(true);

        if (hideTitleTimeout.current !== 0) {
            clearTimeout(hideTitleTimeout.current);
        }

        hideTitleTimeout.current = setTimeout(() => {
            setTitleShown(false);
            hideTitleTimeout.current = 0;
        }, 2000);

        return () => {
            hideTitleTimeout.current = 0;
            setTitleShown(false);
        }
    }, [setTitleShown, videoLink]);

    return (<>
        <div id={"video-title"}
             ref={titleRef}
             className={shown || titleShown ? "shown" : "hidden"}
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
