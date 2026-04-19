import "./Header.css";
import {NavLink} from "react-router";

function Header() {
    return (<>
        <div id={"header"}
        >
            <NavLink to={"/home"}
                     id={"home-text"}
            >
                <img src={"/player-bear.png"}
                     alt={"Website logo"}
                     height={50}
                     width={"auto"}
                />
                <div id={"header-title-holder"}
                >
                    <h1 id={"header-title"}
                    >
                        AnimePlayer
                    </h1>
                    <p id={"header-subtitle"}
                    >by Nours
                    </p>
                </div>
            </NavLink>
        </div>
    </>);
}

export default Header;