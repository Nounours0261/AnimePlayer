import "./Player.css";
import {useEffect, useRef} from "react";
import VideoControls from "./controls/VideoControls.jsx";
import SubtitleHider from "./SubtitleHider.jsx";
import {almostFinishedEvent, playNextEvent} from "./playerEvents.js";

function Player({videoLink, watchPageRef}) {
    const playerRef = useRef(null);
    const videoRef = useRef(null);
    const videoHolderRef = useRef(null);
    const hideMouseTimeout = useRef(0);

    // hide mouse when inactive
    useEffect(() => {
        function moveHandler() {
            videoHolderRef.current.style.cursor = "auto";

            if (hideMouseTimeout.current !== 0) {
                clearTimeout(hideMouseTimeout.current);
            }

            if (videoHolderRef.current.matches(":hover")) {
                hideMouseTimeout.current = setTimeout(() => {
                    videoHolderRef.current.style.cursor = "none";
                    hideMouseTimeout.current = 0;
                }, 1000);
            }
        }

        window.addEventListener("mousemove", moveHandler);

        return () => {
            window.removeEventListener("mousemove", moveHandler);
            if (hideMouseTimeout.current !== 0) {
                clearTimeout(hideMouseTimeout.current);
            }
        };
    }, []);

    // play video when entering the page
    useEffect(() => {
        if (videoLink !== "" && !document.hidden) {
            videoRef.current.play().catch((reason) => {
                if (reason.name !== "NotAllowedError") {
                    console.error(reason);
                }
            });
        }
    }, [videoLink]);

    // play next episode when the current one ends
    function endedHandler() {
        watchPageRef.current.dispatchEvent(new playNextEvent());
    }

    function timeUpdateHandler() {
        const curVideo = videoRef.current;

        if (curVideo.currentTime >= curVideo.duration * 80 / 100) {
            watchPageRef.current.dispatchEvent(new almostFinishedEvent());
        }
    }

    return (<>
        <figure id={"player"}
                ref={playerRef}
        >
            <div id={"video-holder"}
                 ref={videoHolderRef}
            >
                <video
                    src={videoLink}
                    ref={videoRef}
                    disableRemotePlayback
                    onEnded={endedHandler}
                    onTimeUpdate={timeUpdateHandler}
                >
                </video>

                <SubtitleHider
                />

                <VideoControls videoRef={videoRef}
                               playerRef={playerRef}/>
            </div>
        </figure>
    </>);
}

export default Player;