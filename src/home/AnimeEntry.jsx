import {useEffect, useRef, useState} from "react";
import "./AnimeEntry.css";
import {NavLink} from "react-router";
import {listUpdateEvent} from "./HomeEvents.js";
import DefaultCover from "../utils/DefaultCover.jsx";

function AnimeEntry({info, homePageRef}) {
    const [detailed, setDetailed] = useState(false);
    const [nextLink, setNextLink] = useState("");
    const seasonalRef = useRef(null);
    const nextEpRef = useRef(null);
    const [coverSource, setCoverSource] = useState(info.cover ?? null);

    function infoButtonClick() {
        setDetailed(!detailed);
    }

    // load info on creation
    useEffect(() => {
        const browserData = JSON.parse(localStorage.getItem(info.path) ?? "{}");
        const nextEp = browserData.nextEp ?? 1;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNextLink(`/watch/${info.path}/${nextEp}`);
        nextEpRef.current.value = nextEp;

        const seasonalData = JSON.parse(localStorage.getItem("seasonal") ?? "[]");
        seasonalRef.current.checked = seasonalData.includes(info.path);
    }, [info]);

    // Check and save user-controlled anime data
    function infoFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const nextEpInt = parseInt(formData.get("nextEp"));

        if (!isNaN(nextEpInt) && nextEpInt >= 1 && nextEpInt <= info.episodes.length) {
            const newData = {};
            newData.nextEp = nextEpInt;
            localStorage.setItem(info.path, JSON.stringify(newData));
            setNextLink(`/watch/${info.path}/${nextEpInt}`);

            if (formData.get("seasonal") === "yes") {
                const seasonalData = JSON.parse(localStorage.getItem("seasonal") ?? "[]");
                if (!seasonalData.includes(info.path)) {
                    seasonalData.push(info.path);
                }
                localStorage.setItem("seasonal", JSON.stringify(seasonalData));
            } else {
                const seasonalData = JSON.parse(localStorage.getItem("seasonal") ?? "[]");
                const newData = seasonalData.filter((p) => {
                    return p !== info.path;
                });
                localStorage.setItem("seasonal", JSON.stringify(newData));
            }

            setDetailed(false);
            homePageRef.current.dispatchEvent(new listUpdateEvent());
        }
    }

    function coverErrorHandler() {
        setCoverSource(null);
    }

    function closeButtonHandler() {
        setDetailed(false);
    }

    return (<>
        <div className={`anime-entry ${detailed ? "detailed" : ""}`}
        >
            <div className={"left-side"}
            >
                <NavLink to={`${nextLink}`}
                >
                    {
                        coverSource === null
                            ? <DefaultCover/>
                            : <img src={coverSource}
                                   alt={"anime cover"}
                                   className={"poster"}
                                   loading={"lazy"}
                                   onError={coverErrorHandler}
                            />
                    }
                </NavLink>
                <button className={"info-button"}
                        onClick={infoButtonClick}
                >
                    <svg width="20px" height="20px" viewBox="-2 -2 24 24"
                    >
                        <path
                            d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8
                            8 0 1 0 0-16 8 8 0 0 0 0 16zm0-10a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1zm0-1a1
                            1 0 1 1 0-2 1 1 0 0 1 0 2z"
                        />
                    </svg>
                </button>
                <div className={"title"}
                >
                    {info.title}
                </div>
                <svg className={"play-icon"}
                     viewBox="0 0 459 459"
                >
                    <path d="M229.5,0C102.751,0,0,102.751,0,229.5S102.751,459,229.5,459S459,356.249,459,229.5S356.249,0,229.5,0z M310.292,239.651
			                l-111.764,76.084c-3.761,2.56-8.63,2.831-12.652,0.704c-4.022-2.128-6.538-6.305-6.538-10.855V153.416
			                c0-4.55,2.516-8.727,6.538-10.855c4.022-2.127,8.891-1.857,12.652,0.704l111.764,76.084c3.359,2.287,5.37,6.087,5.37,10.151
			                C315.662,233.564,313.652,237.364,310.292,239.651z"
                    />
                </svg>
            </div>
            <form className={`right-side`}
                  onSubmit={infoFormSubmit}
            >
                <div className={"top"}
                >
                    <label>
                        <input type={"checkbox"}
                               ref={seasonalRef}
                               name={"seasonal"}
                               value={"yes"}
                        />
                        Seasonal
                    </label>
                    <div>
                        Total episodes : {info.episodes.length}
                    </div>
                    <label>
                        Next episode : <input type={"number"}
                                              ref={nextEpRef}
                                              name={"nextEp"}
                                              className={"next-ep"}
                    />
                    </label>
                </div>
                <div className={"bottom"}
                >
                    <button type={"button"}
                            className={"close-button"}
                            onClick={closeButtonHandler}
                    >
                        Close
                    </button>
                    <button type={"submit"}
                            className={"save-button"}
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    </>);
}

export default AnimeEntry;