import {useEffect, useRef} from "react";


function ProgressBar({videoRef}) {
    const progressRef = useRef(null);

    useEffect(() => {
        const curVideo = videoRef.current;
        const curProgress = progressRef.current;

        curVideo.addEventListener("loadedmetadata", () => {
            curProgress.setAttribute("max", curVideo.duration);
        });

        curVideo.addEventListener("timeupdate", () => {
            if (!curProgress.getAttribute("max"))
                curProgress.setAttribute("max", curVideo.duration);
            curProgress.value = curVideo.currentTime;
        });

        curProgress.addEventListener("click", (e) => {
            if (!Number.isFinite(curVideo.duration)) return;
            const rect = curProgress.getBoundingClientRect();
            const pos = (e.pageX - rect.left) / curProgress.offsetWidth;
            curVideo.currentTime = pos * curVideo.duration;
        });
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