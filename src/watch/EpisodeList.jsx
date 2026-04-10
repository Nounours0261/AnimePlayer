import "./EpisodeList.css";

function EpisodeList({count, selected, select}) {
    function makeDiv(i) {
        return (
            <button className={"list-entry" + (i === selected ? " selected" : "")}
                    onClick={() => {
                        select(i);
                    }}
                    key={i}
            >
                Episode {i}
            </button>
        );
    }

    return (
        <div className={"episode-list"}
        >
            {
                [...Array(count).keys()].map((i) => {
                    return makeDiv(i + 1);
                })
            }
        </div>
    );
}

export default EpisodeList;