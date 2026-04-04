import PlayPauseButton from "./PlayPauseButton.jsx";
import FullscreenButton from "./FullscreenButton.jsx";
import {useEffect, useRef} from "react";

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
        };
    }, []);

    return (<div id="video-controls"
                 ref={controlsRef}
    >
        <PlayPauseButton videoRef={videoRef}/>

        <progress id={"progress"}
                  value={50}
        >

        </progress>

        <progress id={"volume"}
                  value={50}
        >

        </progress>

        <FullscreenButton playerRef={playerRef}/>
    </div>);
}

export default VideoControls;
