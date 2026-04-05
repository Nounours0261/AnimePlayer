import Player from "./Player.jsx";
import {NavLink, useParams} from "react-router";
import {useState} from "react";

function WatchPage() {

    const [link, setLink] = useState("Oshi_no_Ko/Oshi_no_Ko_08.mp4")

    const {anime, episode} = useParams();

    return (<div id={"container"}>
        <Player videoLink={link}/>
        <div>
            {anime}, {episode}
        </div>
        <button onClick={() => {setLink("Oshi_no_Ko/Oshi_no_Ko_09.mp4")}}>Change</button>
        <NavLink to={"/home"}
        >
            Home
        </NavLink>
    </div>);
}

export default WatchPage;