import "./Header.css";

function Header() {
    return (<>
        <div id={"header"}
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
        </div>
    </>);
}

export default Header;