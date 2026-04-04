import {useCallback, useEffect, useState} from "react";


function FullscreenButton({playerRef}) {
    const [isFull, setIsFull] = useState(false);

    const swapFullscreen = useCallback(() => {
        if (isFull) {
            document.exitFullscreen();
        } else {
            playerRef.current.requestFullscreen();
        }
        // state is set in an event listener
    }, [isFull, playerRef]);

    useEffect(() => {
        function keyHandler(event) {
            if (event.key === "f") {
                event.preventDefault();
                event.stopPropagation();
                swapFullscreen();
            }
        }

        function escapeHandler() {
            setIsFull(document.fullscreenElement !== null);
        }

        window.addEventListener("fullscreenchange", escapeHandler);
        window.addEventListener("keydown", keyHandler);

        return () => {
            window.removeEventListener("fullscreenchange", escapeHandler);
            window.removeEventListener("keydown", keyHandler);
        }
    }, [isFull, setIsFull, swapFullscreen]);

    return <button id={"fullscreen"}
                   type={"button"}
                   onClick={swapFullscreen}
    >
        Fullscreen
    </button>;
}

export default FullscreenButton;