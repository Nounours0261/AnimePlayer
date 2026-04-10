import PlayPauseButton from "./PlayPauseButton.jsx";
import FullscreenButton from "./FullscreenButton.jsx";
import {useEffect, useRef} from "react";
import ProgressBar from "./ProgressBar.jsx";
import "./VideoControls.css";
import VolumeBar from "./VolumeBar.jsx";

function VideoControls({videoRef, playerRef}) {
    const controlsRef = useRef(null);
    const hideTimeout = useRef(0);

    useEffect(() => {
        function moveHandler() {
            controlsRef.current.style.display = "block";

            if (hideTimeout.current !== 0) {
                clearTimeout(hideTimeout.current);
            }

            if (!controlsRef.current.matches(":hover")) {
                hideTimeout.current = setTimeout(() => {
                    controlsRef.current.style.display = "none";
                    hideTimeout.current = 0;
                }, 1000);
            }
        }

        window.addEventListener("mousemove", moveHandler);

        return () => {
            window.removeEventListener("mousemove", moveHandler);
            if (hideTimeout.current !== 0) {
                clearTimeout(hideTimeout.current);
            }
        };
    }, []);

    return (<div id="video-controls"
                 ref={controlsRef}
    >
        <PlayPauseButton videoRef={videoRef}/>

        <ProgressBar videoRef={videoRef}
            >

        </ProgressBar>
        <VolumeBar videoRef={videoRef}
        />

        <FullscreenButton playerRef={playerRef}/>
    </div>);
}

export default VideoControls;
