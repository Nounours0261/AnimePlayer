import "./Player.css";
import {useEffect, useRef} from "react";
import VideoControls from "./controls/VideoControls.jsx";
import SubtitleHider from "./SubtitleHider.jsx";
import {almostFinishedEvent, playNextEvent} from "./playerEvents.js";

function Player({videoLink, watchPageRef, error, title}) {
    const playerRef = useRef(null);
    const videoRef = useRef(null);
    const videoHolderRef = useRef(null);
    const hideMouseTimeout = useRef(0);

    // hide mouse when inactive
    // blur elements when clicked
    useEffect(() => {
        function moveHandler() {
            videoHolderRef.current.style.cursor = "auto";

            if (hideMouseTimeout.current !== 0) {
                clearTimeout(hideMouseTimeout.current);
            }

            hideMouseTimeout.current = setTimeout(() => {
                videoHolderRef.current.style.cursor = "none";
                hideMouseTimeout.current = 0;
            }, 1000);
        }

        function superBlur() {
            document.activeElement.blur();
        }

        const curError = error;
        if (curError === null) {
            window.addEventListener("mousemove", moveHandler);
        }
        window.addEventListener("click", superBlur);

        return () => {
            if (curError === null) {
                window.removeEventListener("mousemove", moveHandler);
            }
            if (hideMouseTimeout.current !== 0) {
                clearTimeout(hideMouseTimeout.current);
            }
            window.removeEventListener("click", superBlur);
        };
    }, [error]);

    // play video when entering the page
    useEffect(() => {
        if (videoLink !== null && !document.hidden) {
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
            {
                error
                ??
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
                                   playerRef={playerRef}
                                   title={title}
                    />
                </div>
            }
        </figure>
    </>);
}

export default Player;