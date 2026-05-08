import AnimeEntry from "./AnimeEntry.jsx";
import "./AnimeRow.css";
import {useState} from "react";


function AnimeRow({elements, oneLine, title, homePageRef}) {
    const [searchValue, setSearchValue] = useState("");

    function filterChange(e) {
        setSearchValue(e.target.value);
    }

    function makeEntryList() {
        let list = elements;
        if (searchValue !== "") {
            list = list.map((e) => {
                const title = e.title.toLowerCase();
                const s = searchValue.toLowerCase();

                let distance = -1;
                if (title.includes(s)) {
                    distance = 2;
                }
                if (title.includes(" " + s)) {
                    distance = 1;
                }
                if (title.startsWith(s)) {
                    distance = 0;
                }
                return {data: e, distance};
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
                                         value={searchValue}
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