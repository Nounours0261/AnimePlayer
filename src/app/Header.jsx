import "./Header.css";
import {NavLink} from "react-router";
import Bear from "../svg/Bear.jsx";

function Header() {
    return (<>
        <div id={"header"}
        >
            <NavLink to={"/home"}
                     id={"home-text"}
            >
                <Bear height={55}
                      type={"logo-bear"}
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