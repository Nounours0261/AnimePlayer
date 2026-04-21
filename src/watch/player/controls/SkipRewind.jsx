import {useEffect, useMemo} from "react";

function SkipRewind({videoRef, showControls}) {
    const changeVideoTime = useMemo(() => {
        function wrapper() {
            let isWaiting = false;
            let savedValue = null;
            let interval = null;

            function throttled(n) {
                if (isWaiting) {
                    savedValue = n;
                    return;
                }

                const curVideo = videoRef.current;
                if (curVideo.currentTime < curVideo.duration) {
                    curVideo.currentTime += n;
                }
                showControls();
                isWaiting = true;

                interval = setInterval(() => {
                    if (savedValue !== null) {
                        if (curVideo.currentTime < curVideo.duration) {
                            curVideo.currentTime += savedValue;
                        }
                        showControls();
                        savedValue = null;
                    } else {
                        clearInterval(interval);
                        interval = null;
                        isWaiting = false;
                    }
                }, 200);
            }

            return throttled;
        }

        return wrapper();
    }, [showControls, videoRef]);

    // keyboard handler for skip/rewind
    useEffect(() => {
        function keyHandler(e) {
            if (e.key === "ArrowRight") {
                changeVideoTime(e.shiftKey ? 1 / 24 : 5);
            }
            if (e.key === "ArrowLeft") {
                changeVideoTime(e.shiftKey ? -1 / 24 : -5);
            }
            if (e.key === "u") {
                changeVideoTime(85);
            }
        }

        window.addEventListener("keydown", keyHandler);

        return () => {
            window.removeEventListener("keydown", keyHandler);
        };
    }, [changeVideoTime, showControls, videoRef]);

    return (<></>);
}

export default SkipRewind;