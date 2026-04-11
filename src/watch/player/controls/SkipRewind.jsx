import {useEffect} from "react";

function SkipRewind({videoRef}) {
    useEffect(() => {
        const curVideo = videoRef.current;

        function keyHandler(e) {
            if (e.key === "ArrowRight") {
                curVideo.currentTime += 5;
            }
            if (e.key === "ArrowLeft") {
                curVideo.currentTime -= 5;
            }
        }

        window.addEventListener("keydown", keyHandler);

        return () => {
            window.removeEventListener("keydown", keyHandler);
        };
    }, [videoRef]);

    return (<></>);
}

export default SkipRewind;