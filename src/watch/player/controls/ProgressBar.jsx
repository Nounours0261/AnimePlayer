import {useEffect, useMemo, useRef, useState} from "react";
import "./ProgressBar.css";

function ProgressBar({videoRef}) {
    const progressRef = useRef(null);
    const [videoProgress, setVideoProgress] = useState(0);
    const [videoLength, setVideoLength] = useState(0);
    const isMoving = useRef(false);
    const [timeMode, setTimeMode] = useState(localStorage.getItem("time-mode"));

    // video event handlers for setting state
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
                }, 200);
            }

            return throttled;
        }

        return wrapper();
    }, [videoRef]);

    function formatTime() {
        let floored = Math.floor(videoProgress);
        if (timeMode === "countdown") {
            floored = Math.floor(videoLength) - floored;
        }
        const totalMins = Math.floor(floored / 60);

        const secs = floored % 60;
        const mins = totalMins % 60;
        const hours = Math.floor(totalMins / 60);

        const secString = `${secs < 10 ? "0" : ""}${secs}`;
        const minString = `${mins < 10 ? "0" : ""}${mins}`;
        const hourString = hours > 0 ? `${hours}:` : "";
        return `${timeMode === "countdown" ? "-" : ""}${hourString}${minString}:${secString}`;
    }

    function barHandler(e) {
        setVideoProgress(e.target.value);
        changeVideoTime(e.target.value);
    }

    function timeModeHandler() {
        setTimeMode(timeMode === "countdown" ? "default" : "countdown");
    }

    return (<>
        <div id={"progress-holder"}
             className={"bar"}
        >
            <button id={"time-info"}
                    onClick={timeModeHandler}
                    title={"Swap display"}
            >
                <div>
                    <p>{formatTime()}</p>
                </div>
            </button>
            <input id={"progress"}
                   type={"range"}
                   min={0}
                   max={videoLength}
                   value={videoProgress}
                   ref={progressRef}
                   onInput={barHandler}
            />
        </div>
    </>);
}

export default ProgressBar;