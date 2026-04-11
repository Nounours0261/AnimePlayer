import {useEffect} from "react";

function SkipRewind({videoRef, showControls}) {
    // keyboard handler for skip/rewind
    useEffect(() => {
        const curVideo = videoRef.current;

        function keyHandler(e) {
            if (e.key === "ArrowRight") {
                if (curVideo.currentTime < curVideo.duration) {
                    curVideo.currentTime += 5;
                }
                showControls();
            }
            if (e.key === "ArrowLeft") {
                curVideo.currentTime -= 5;
                showControls();
            }
        }

        window.addEventListener("keydown", keyHandler);

        return () => {
            window.removeEventListener("keydown", keyHandler);
        };
    }, [showControls, videoRef]);

    return (<></>);
}

export default SkipRewind;