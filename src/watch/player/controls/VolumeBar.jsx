import {useEffect, useMemo, useState} from "react";
import "./VolumeBar.css";

function VolumeBar({videoRef}) {
    const [volume, setVolume] = useState(parseInt(localStorage.getItem("volume") ?? 100));
    const [muted, setMuted] = useState(localStorage.getItem("muted") === "true");

    // Set initial volume
    useEffect(() => {
        videoRef.current.volume = parseInt(localStorage.getItem("volume") ?? 100) / 100;
        videoRef.current.muted = localStorage.getItem("muted") === "true";
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
                localStorage.setItem("volume", `${n}`);
                isWaiting = true;

                interval = setInterval(() => {
                    if (savedValue !== null) {
                        curVideo.volume = savedValue / 100;
                        localStorage.setItem("volume", `${savedValue}`);
                        curVideo.muted = false;
                        setMuted(false);
                        localStorage.setItem("muted", `false`);
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

    function barHandler(e) {
        setVolume(e.target.value);
        changeVideoVolume(e.target.value);
    }

    function muteHandler() {
        videoRef.current.muted = !muted;
        setMuted(!muted);
        localStorage.setItem("muted", `${!muted}`);
    }

    return (<div id={"volume-holder"}
                 className={"bar"}
        >
            <button id={"mute-button"}
                    onClick={muteHandler}
                    title={"Mute"}
            >
                <svg id={"volume-icon"}
                     viewBox="0 0 32 32"
                >
                    <path d="M16,6v20c0,1.1-0.772,1.537-1.715,0.971l-6.57-3.942C6.772,22.463,5.1,22,4,22H3c-1.1,0-2-0.9-2-2
                        v-8c0-1.1,0.9-2,2-2h1c1.1,0,2.772-0.463,3.715-1.029l6.57-3.942C15.228,4.463,16,4.9,16,6z M26.606,5.394
                        c-0.781-0.781-2.047-0.781-2.828,0s-0.781,2.047,0,2.828C25.855,10.3,27,13.062,27,16s-1.145,5.7-3.222,7.778
                        c-0.781,0.781-0.781,2.047,0,2.828c0.391,0.391,0.902,0.586,1.414,0.586s1.023-0.195,1.414-0.586C29.439,23.773,31,20.007,31,16
                        S29.439,8.227,26.606,5.394z M22.363,9.636c-0.781-0.781-2.047-0.781-2.828,0s-0.781,2.047,0,2.828C20.479,13.409,21,14.664,21,16
                        s-0.52,2.591-1.464,3.535c-0.781,0.781-0.781,2.047,0,2.828c0.391,0.391,0.902,0.586,1.414,0.586s1.023-0.195,1.414-0.586
                        C24.064,20.664,25,18.404,25,16S24.063,11.336,22.363,9.636z"/>
                    {muted ? <path className={"line"}
                                   d="M4 28 L28 4"
                                   strokeWidth="5"
                                   strokeLinecap="round"
                    /> : null}
                </svg>
            </button>
            <input id={"volume"}
                   type={"range"}
                   min={0}
                   max={100}
                   value={volume}
                   onInput={barHandler}
            >

            </input></div>
    );
}

export default VolumeBar;