import "./Error.css";

function Error({message}) {
    return (<div className={"home-error"}
    >
        <div className={"right-side"}
        >
            <img src={"/error-bear.png"} alt={"error icon"}/>
        </div>
        <div className={"left-side"}
        >
            <h1 className={"error-title"}
            >
                An error occured !
            </h1>
            <p className={"error-message"}
            >
                {message}
            </p>
        </div>
    </div>);
}

export default Error;