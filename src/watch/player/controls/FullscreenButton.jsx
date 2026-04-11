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

    // fullscreen keyboard handler
    // fullscreen event listener for state setting
    useEffect(() => {
        function keyHandler(event) {
            if (event.key === "f") {
                event.preventDefault();
                event.stopPropagation();
                swapFullscreen();
            }
        }

        function fullscreenHandler() {
            setIsFull(document.fullscreenElement !== null);
        }

        window.addEventListener("fullscreenchange", fullscreenHandler);
        window.addEventListener("keydown", keyHandler);

        return () => {
            window.removeEventListener("fullscreenchange", fullscreenHandler);
            window.removeEventListener("keydown", keyHandler);
        };
    }, [isFull, setIsFull, swapFullscreen]);

    return <button id={"fullscreen"}
                   type={"button"}
                   onClick={swapFullscreen}
    >
        Fullscreen
    </button>;
}

export default FullscreenButton;