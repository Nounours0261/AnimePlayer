import {useEffect, useRef} from "react";

function VolumeBar({videoRef}) {
    const volumeRef = useRef(null);

    // click event listener for sound setting
    useEffect(() => {
        const curVideo = videoRef.current;
        const curVolume = volumeRef.current;

        function clickHandler(e) {
            const rect = curVolume.getBoundingClientRect();
            const newVolume = (e.pageX - rect.left) / curVolume.offsetWidth;
            curVideo.volume = newVolume;
            curVolume.value = newVolume;
            localStorage.setItem("volume", newVolume);
        }

        curVolume.addEventListener("click", clickHandler);

        return () => {
            curVolume.removeEventListener("click", clickHandler);
        };
    }, [videoRef]);

    // load settings from browser on display
    useEffect(() => {
        const volumeSetting = localStorage.getItem("volume") ?? 1;
        videoRef.current.volume = volumeSetting;
        volumeRef.current.value = volumeSetting;
    }, [videoRef]);

    return (<progress id={"volume"}
                      value={1}
                      ref={volumeRef}
                      max={1}
    >

    </progress>);
}

export default VolumeBar;