import {useCallback, useEffect, useRef, useState} from "react";
import "./AnimeEntry.css";
import {NavLink} from "react-router";
import {getAnimeInfo} from "../utils/jsonReader.js";
import {listUpdateEvent} from "./HomeEvents.js";

function AnimeEntry({path, homePageRef}) {
    const [info, setInfo] = useState({
        title: "", episodes: [], cover: "/default-cover.png",
    });
    const [detailed, setDetailed] = useState(false);
    const [nextLink, setNextLink] = useState("");
    const seasonalRef = useRef(null);
    const nextEpRef = useRef(null);

    function infoButtonClick() {
        setDetailed(!detailed);
    }

    const clearCover = useCallback(() => {
        const newInfo = {
            ...info,
        };
        newInfo.cover = "/default-cover.png";
        setInfo(newInfo);
    }, [info, setInfo]);

    // load info on creation
    useEffect(() => {
        let ignore = false;
        getAnimeInfo(path).then((res) => {
            if (!ignore) {
                if (res.ok) {
                    if (res.cover === null) {
                        res.cover = "/default-cover.png";
                    }
                    setInfo(res);
                } else {
                    window.alert(`Failed to get info on '${path}', check console for more info`);
                }
            }
        });

        const browserData = JSON.parse(localStorage.getItem(path) ?? "{}");
        const nextEp = browserData.nextEp ?? 1;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNextLink(`/watch/${path}/${nextEp}`);
        nextEpRef.current.value = nextEp;

        const seasonalData = JSON.parse(localStorage.getItem("seasonal") ?? "[]");
        seasonalRef.current.checked = seasonalData.includes(path);

        return () => {
            ignore = true;
        };
    }, [path]);

    function infoFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const nextEpInt = parseInt(formData.get("nextEp"));

        if (!isNaN(nextEpInt) && nextEpInt >= 1 && nextEpInt <= info.episodes.length) {
            const newData = {};
            newData.nextEp = nextEpInt;
            localStorage.setItem(path, JSON.stringify(newData));
            setNextLink(`/watch/${path}/${nextEpInt}`);

            if (formData.get("seasonal") === "yes") {
                const seasonalData = JSON.parse(localStorage.getItem("seasonal") ?? "[]");
                if (!seasonalData.includes(path)) {
                    seasonalData.push(path);
                }
                localStorage.setItem("seasonal", JSON.stringify(seasonalData));
            } else {
                const seasonalData = JSON.parse(localStorage.getItem("seasonal") ?? "[]");
                const newData = seasonalData.filter((p) => {
                    return p !== path;
                });
                localStorage.setItem("seasonal", JSON.stringify(newData));
            }

            setDetailed(false);
            homePageRef.current.dispatchEvent(new listUpdateEvent());
        }
    }

    return (<div className={"anime-entry"}
    >
        <div className={"left-side"}
        >
            <img src={info.cover}
                 alt={"anime cover"}
                 className={"poster"}
                 onError={clearCover}
                 width={"230px"}
                 height={"325px"}
            />
            <button className={"info-button"}
                    onClick={infoButtonClick}
            >
                i
            </button>
            <div className={"title"}
            >
                {info.title}
            </div>
            <div className={"button-holder"}
            >
                <NavLink to={`/watch/${path}/1`}
                >
                    First
                </NavLink>
                <NavLink to={`${nextLink}`}
                >
                    Latest
                </NavLink>
            </div>
        </div>
        <form className={`right-side ${detailed ? "shown" : "hidden"}`}
              onSubmit={infoFormSubmit}
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
            />
            </label>
            <button type={"submit"}
            >
                Save
            </button>
        </form>
    </div>);
}

export default AnimeEntry;