import {useCallback, useEffect, useState} from "react";
import "./PlayPauseButton.css";

function PlayPauseButton({videoRef}) {
    const [isPlaying, setIsPlaying] = useState(false);

    const playPause = useCallback(() => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play().then(() => {
            });
        }
    }, [isPlaying, videoRef]);

    // play/pause keyboard handler
    // video click handler for play/pause
    // play/pause event listeners for state setting
    useEffect(() => {
        function keyHandler(event) {
            if (event.key === " ") {
                event.preventDefault();
                event.stopPropagation();
                playPause();
            }
        }

        function playHandler() {
            setIsPlaying(true);
        }

        function pauseHandler() {
            setIsPlaying(false);
        }

        const currentVideo = videoRef.current;
        window.addEventListener("keydown", keyHandler);
        currentVideo.addEventListener("click", playPause);
        currentVideo.addEventListener("play", playHandler);
        currentVideo.addEventListener("pause", pauseHandler);

        return () => {
            window.removeEventListener("keydown", keyHandler);
            currentVideo.removeEventListener("click", playPause);
            currentVideo.removeEventListener("play", playHandler);
            currentVideo.removeEventListener("pause", pauseHandler);
        };
    }, [playPause, videoRef]);

    return (<>
        <button id={"play-pause"}
                type={"button"}
                onClick={playPause}
                className={`single-button ${isPlaying ? "playing" : "paused"}`}
                title={isPlaying ? "Pause" : "Play"}
        >
            {isPlaying
                ?
                <svg id={"pause-icon"}
                     viewBox="0 0 24 24"
                >
                    <path
                        d="M19,4V20a2,2,0,0,1-2,2H15a2,2,0,0,1-2-2V4a2,2,0,0,1,2-2h2A2,2,0,0,1,19,4ZM9,2H7A2,2,0,0,0,5,4V20a2,2,0,0,0,2,2H9a2,2,0,0,0,2-2V4A2,2,0,0,0,9,2Z"/>
                </svg>
                :
                <svg id={"play-icon"}
                     viewBox="0 0 460.114 460.114"
                >
                    <path d="M393.538,203.629L102.557,5.543c-9.793-6.666-22.468-7.372-32.94-1.832c-10.472,5.538-17.022,16.413-17.022,28.26v396.173
			                c0,11.846,6.55,22.721,17.022,28.26c10.471,5.539,23.147,4.834,32.94-1.832l290.981-198.087
			                c8.746-5.954,13.98-15.848,13.98-26.428C407.519,219.477,402.285,209.582,393.538,203.629z"/>
                </svg>
            }
        </button>
    </>);
}

export default PlayPauseButton;