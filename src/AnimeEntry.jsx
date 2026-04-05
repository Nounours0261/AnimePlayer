import {useEffect, useState} from "react";
import "./AnimeEntry.css";
import {NavLink} from "react-router";

function AnimeEntry({path}) {

    const [info, setInfo] = useState({
        title: "",
        episodes: []
    });


    useEffect(() => {
        async function getInfo() {
            const index = await fetch(`/anime/${path}/info.json`);
            return await index.json();
        }

        let ignore = false;
        getInfo().then((res) => {
            if (!ignore) {
                setInfo(res);
            }
        });
        return () => {
            ignore = true;
        }
    }, [path]);

    return (
        <div className={"anime-entry"}
        >
            <img src={"/default-cover.png"}
                 alt={"anime cover"}
                 className={"poster"}
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