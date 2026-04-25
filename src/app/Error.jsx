import "./Error.css";
import Bear from "../svg/Bear.jsx";

function Error({message, children}) {
    return (<div className={"error"}
    >
        <div className={"right-side"}
        >
            <Bear height={230}
                  type={"error-bear"}
            />
        </div>
        <div className={"left-side"}
        >
            <div>
                <h1 className={"error-title"}
                >
                    An error occured !
                </h1>
                <p className={"error-message"}
                >
                    {message}
                </p>
            </div>
            <div className={"error-custom"}
            >
                {children}
            </div>
        </div>
    </div>);
}

export default Error;