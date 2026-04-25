import Bear from "../svg/Bear.jsx";
import "./DefaultCover.css";

function DefaultCover() {
    return (
        <div className={"default-cover"}>
            <Bear type={"question-bear"}
                  width={"100%"}
            />
        </div>
    );
}

export default DefaultCover;