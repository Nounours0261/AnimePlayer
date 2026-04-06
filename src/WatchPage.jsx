import Player from "./Player.jsx";
import {NavLink, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import EpisodeList from "./EpisodeList.jsx";
import {getAnimeInfo} from "./utils/jsonReader.js";

function WatchPage() {
    const [animeInfo, setAnimeInfo] = useState({});
    const [link, setLink] = useState(null);

    const {anime, episode} = useParams();
    const navigate = useNavigate();

    function changeEpisode(number) {
        navigate(`/watch/${anime}/${number}`);
        setLink(`/anime/${anime}/${((animeInfo.episodes ?? [])[number - 1] ?? "")}`);
    }

    useEffect(() => {
        let ignore = false;
        getAnimeInfo(anime).then((info) => {
            if (!ignore) {
                if (info.ok) {
                    setAnimeInfo(info);
                    setLink(`/anime/${anime}/${((info.episodes ?? [])[episode - 1] ?? "")}`);
                } else {
                    window.alert(`Failed to get info about '${anime}', check console for more info`);
                }
            }
        });
        return () => {
            ignore = true;
        };
    }, []);

    return (<div id={"container"}>
        <EpisodeList count={(animeInfo.episodes ?? []).length}
                     selected={parseInt(episode)}
                     select={changeEpisode}
        />

        <Player videoLink={link}
        />

        <div>
            {anime}, {episode}
        </div>
        <button onClick={() => {
            getAnimeInfo("bheee");
        }}>Change
        </button>
        <NavLink to={"/home"}
        >
            Home
        </NavLink>
    </div>);
}

export default WatchPage;