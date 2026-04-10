import {useCallback, useEffect, useState} from "react";
import "./AnimeEntry.css";
import {NavLink} from "react-router";
import {getAnimeInfo} from "../utils/jsonReader.js";

function AnimeEntry({path}) {

    const [info, setInfo] = useState({
        title: "",
        episodes: [],
        cover: "/default-cover.png",
    });

    const clearCover = useCallback(() => {
        const newInfo = {
            ...info,
        };
        newInfo.cover = "/default-cover.png";
        setInfo(newInfo);
    }, [info, setInfo]);


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
        return () => {
            ignore = true;
        };
    }, [path]);

    return (
        <div className={"anime-entry"}
        >
            <img src={info.cover}
                 alt={"anime cover"}
                 className={"poster"}
                 onError={clearCover}
            />
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
                <NavLink to={`/watch/${path}/1`}
                >
                    Latest
                </NavLink>
            </div>
        </div>
    );
}

export default AnimeEntry;