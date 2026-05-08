import AnimeEntry from "./AnimeEntry.jsx";
import "./AnimeRow.css";
import {useState} from "react";

function AnimeRow({elements, oneLine, title, homePageRef}) {
    const [filterValue, setFilterValue] = useState("");

    function filterChange(e) {
        setFilterValue(e.target.value);
    }

    function makeEntryList() {
        function fuzzySearch(title) {
            const needle = filterValue.toLowerCase();
            const haystack = title.toLowerCase();

            let distance;
            let hayIndex;

            if (haystack.charAt(0) === needle.charAt(0)) {
                hayIndex = 1;
                distance = 0;
            } else {
                hayIndex = 1;
                while (hayIndex < haystack.length && haystack.charAt(hayIndex) !== needle.charAt(0)) {
                    hayIndex += 1;
                }
                if (hayIndex === haystack.length) {
                    return -1;
                }

                if (haystack.charAt(hayIndex - 1) === " ") {
                    distance = 1;
                } else {
                    distance = 2;
                }
            }

            let needleIndex = 1;

            while (hayIndex < haystack.length) {
                if (haystack.charAt(hayIndex) === needle.charAt(needleIndex)) {
                    needleIndex += 1;
                } else {
                    distance += 1;
                }
                if (needleIndex === needle.length) {
                    console.log(distance, title);
                    return distance;
                }
                hayIndex += 1;
            }

            return -1;
        }

        let list = elements;
        if (filterValue !== "") {
            list = list.map((e) => {
                return {data: e, distance: fuzzySearch(e.title)};
            }).filter((e) => {
                return e.distance !== -1;
            }).sort((e, f) => {
                return e.distance - f.distance;
            }).map((e) => {
                return e.data;
            });
        }

        return list.map((anime, index) => {
            return (<AnimeEntry info={anime}
                                key={index}
                                homePageRef={homePageRef}
            />);
        });
    }

    return (<>
        <div className={`anime-row ${oneLine ? "one-line" : ""}`}
        >
            <div className={"anime-row-title"}
            >
                {title}
            </div>

            <div className={"anime-row-content"}>

                {oneLine ? null : <input className={"anime-row-search"}
                                         type={"text"}
                                         name={"search"}
                                         value={filterValue}
                                         onChange={filterChange}
                                         placeholder={"Search"}
                />}

                <div className={"anime-row-items"}
                >
                    {makeEntryList()}
                </div>
            </div>
        </div>
    </>);
}

export default AnimeRow;