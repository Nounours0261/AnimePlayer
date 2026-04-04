import {useCallback, useEffect, useState} from "react";


function PlayPauseButton({videoRef}) {
    const [isPlaying, setIsPlaying] = useState(false);

    const playPause = useCallback(() => {
        if (isPlaying) {
            videoRef.current.pause()
            setIsPlaying(false);
        } else {
            videoRef.current.play().then(() => {
                setIsPlaying(true);
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
        window.addEventListener("keydown", keyHandler)

        const currentVideo = videoRef.current;
        currentVideo.addEventListener("click", playPause)

        return () => {
            window.removeEventListener("keydown", keyHandler);
            currentVideo.removeEventListener("click", playPause);
        }
    }, [playPause, videoRef]);

    return <button id={"play-pause"}
                   type={"button"}
                   onClick={playPause}
    >
        Play/Pause
    </button>;
}

export default PlayPauseButton;