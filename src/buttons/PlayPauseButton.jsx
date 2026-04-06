import {useCallback, useEffect, useState} from "react";


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

    return <button id={"play-pause"}
                   type={"button"}
                   onClick={playPause}
    >
        Play/Pause
    </button>;
}

export default PlayPauseButton;