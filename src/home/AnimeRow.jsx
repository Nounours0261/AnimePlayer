import AnimeEntry from "./AnimeEntry.jsx";
import "./AnimeRow.css";

function AnimeRow({paths, oneLine, title, homePageRef}) {
    return (<>
        <div className={`anime-row ${oneLine ? "one-line" : ""}`}
        >
            <div className={"anime-row-title"}
            >
                {title}
            </div>
            <div className={"anime-row-items"}
            >
                {paths.map((anime, index) => {
                    return (
                        <AnimeEntry path={anime}
                                    key={index}
                                    homePageRef={homePageRef}
                        />
                    );
                })}
            </div>
        </div>
    </>);
}

export default AnimeRow;