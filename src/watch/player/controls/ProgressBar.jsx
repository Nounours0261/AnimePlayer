import {useEffect, useMemo, useRef, useState} from "react";


function ProgressBar({videoRef}) {
    const progressRef = useRef(null);
    const [videoProgress, setVideoProgress] = useState(0);
    const [videoLength, setVideoLength] = useState(0);
    const isMoving = useRef(false);

    // video event handlers for setting state
    // bar click handler for time changing
    useEffect(() => {
        const curVideo = videoRef.current;

        function metaDataHandler() {
            setVideoLength(curVideo.duration);
        }

        function timeUpdateHandler() {
            if (videoLength === 0) {
                setVideoLength(curVideo.duration);
            }
            if (!isMoving.current) {
                setVideoProgress(curVideo.currentTime);
            }
        }

        curVideo.addEventListener("loadedmetadata", metaDataHandler);
        curVideo.addEventListener("timeupdate", timeUpdateHandler);

        return () => {
            curVideo.removeEventListener("loadedmetadata", metaDataHandler);
            curVideo.removeEventListener("timeupdate", timeUpdateHandler);
        };
    }, [videoLength, videoRef, isMoving]);

    // throttled function to change the current time when seeking
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

                curVideo.currentTime = n;
                isWaiting = true;
                isMoving.current = true;

                interval = setInterval(() => {
                    if (savedValue !== null) {
                        curVideo.currentTime = savedValue;
                        savedValue = null;
                    } else {
                        clearInterval(interval);
                        interval = null;
                        isWaiting = false;
                        isMoving.current = false;
                    }
                }, 50);
            }

            return throttled;
        }

        return wrapper();
    }, [videoRef]);

    function formatTime() {
        const floored = Math.floor(videoProgress);
        const totalMins = Math.floor(floored / 60);

        const secs = floored % 60;
        const mins = totalMins % 60;
        const hours = Math.floor(totalMins / 60);

        const secString = `${secs < 10 ? "0" : ""}${secs}`;
        const minString = `${mins < 10 ? "0" : ""}${totalMins}`;
        const hourString = hours > 0 ? `${hours}:` : "";
        return `${hourString}${minString}:${secString}`;
    }

    function inputHandler(e) {
        setVideoProgress(e.target.value);
        changeVideoTime(e.target.value);
        progressRef.current.blur();
    }

    return (
        <div id={"progress-holder"}
        >
            <span>
                {formatTime()}
            </span>
            <input id={"progress"}
                   type={"range"}
                   min={0}
                   max={videoLength}
                   value={videoProgress}
                   ref={progressRef}
                   onInput={inputHandler}
            />
        </div>
    );
}

export default ProgressBar;