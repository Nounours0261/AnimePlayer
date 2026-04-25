import "./Error.css";

function Error({message, children}) {
    return (<div className={"error"}
    >
        <div className={"right-side"}
        >
            <img src={"/error-bear.png"} alt={"error icon"}/>
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