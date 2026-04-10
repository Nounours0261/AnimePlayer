import {useEffect, useRef} from "react";


function ProgressBar({videoRef}) {
    const progressRef = useRef(null);

    useEffect(() => {
        const curVideo = videoRef.current;
        const curProgress = progressRef.current;

        function metaDataHandler() {
            curProgress.setAttribute("max", curVideo.duration);
        }

        function timeUpdateHandler() {
            if (!curProgress.getAttribute("max"))
                curProgress.setAttribute("max", curVideo.duration);
            curProgress.value = curVideo.currentTime;
        }

        function clickHandler(e) {
            if (!Number.isFinite(curVideo.duration)) return;
            const rect = curProgress.getBoundingClientRect();
            const pos = (e.pageX - rect.left) / curProgress.offsetWidth;
            curVideo.currentTime = pos * curVideo.duration;
        }

        curVideo.addEventListener("loadedmetadata", metaDataHandler);
        curVideo.addEventListener("timeupdate", timeUpdateHandler);
        curProgress.addEventListener("click", clickHandler);

        return () => {
            curVideo.removeEventListener("loadedmetadata", metaDataHandler);
            curVideo.removeEventListener("timeupdate", timeUpdateHandler);
            curProgress.removeEventListener("click", clickHandler);
        };
    }, [videoRef]);

    return (
        <progress id={"progress"}
                  value={50}
                  ref={progressRef}
        >

        </progress>
    );
}

export default ProgressBar;