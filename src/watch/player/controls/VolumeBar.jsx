import {useEffect, useMemo, useState} from "react";

function VolumeBar({videoRef}) {
    const [volume, setVolume] = useState(parseInt(localStorage.getItem("volume") ?? 100));

    // Set initial volume
    useEffect(() => {
        videoRef.current.volume = parseInt(localStorage.getItem("volume") ?? 100) / 100;
    }, [videoRef]);

    // throttled function to change the video volume
    const changeVideoVolume = useMemo(() => {
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

                curVideo.volume = n / 100;
                localStorage.setItem("volume", n);
                isWaiting = true;

                interval = setInterval(() => {
                    if (savedValue !== null) {
                        curVideo.volume = savedValue / 100;
                        localStorage.setItem("volume", savedValue);
                        savedValue = null;
                    } else {
                        clearInterval(interval);
                        interval = null;
                        isWaiting = false;
                    }
                }, 50);
            }

            return throttled;
        }

        return wrapper();
    }, [videoRef]);

    function inputHandler(e) {
        setVolume(e.target.value);
        changeVideoVolume(e.target.value);
    }

    return (
        <input id={"volume"}
               type={"range"}
               min={0}
               max={100}
               value={volume}
               onInput={inputHandler}
        >

        </input>
    );
}

export default VolumeBar;