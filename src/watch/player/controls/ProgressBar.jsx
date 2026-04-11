import {useEffect, useRef, useState} from "react";


function ProgressBar({videoRef}) {
    const progressRef = useRef(null);
    const [videoProgress, setVideoProgress] = useState(0);
    const [videoLength, setVideoLength] = useState(0);

    // video event handlers for setting state
    // bar click handler for time changing
    useEffect(() => {
        const curVideo = videoRef.current;
        const curProgress = progressRef.current;

        function metaDataHandler() {
            setVideoLength(curVideo.duration);
        }

        function timeUpdateHandler() {
            if (videoLength === 0) {
                setVideoLength(curVideo.duration);
            }
            setVideoProgress(curVideo.currentTime);
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
    }, [videoLength, videoRef]);

    function formatTime() {
        const floored = Math.floor(videoProgress);
        const mins = Math.floor(floored / 60);
        const secs = floored % 60;
        return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }

    return (
        <div id={"progress-holder"}
        >
            <span>
                {formatTime()}
            </span>
            <progress id={"progress"}
                      value={videoProgress}
                      ref={progressRef}
                      max={videoLength}
            />
        </div>
    );
}

export default ProgressBar;