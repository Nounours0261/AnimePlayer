import {BrowserRouter, Navigate, Route, Routes} from "react-router";
import HomePage from "../home/HomePage.jsx";
import WatchPage from "../watch/WatchPage.jsx";
import Header from "./Header.jsx";
import {useEffect} from "react";
import {setTheme, themeColors} from "../utils/themeColors.js";

function App() {
    useEffect(() => {
        let curValue = "yellow";

        let interval = setInterval(() => {
            const i = Math.floor(Math.random() * 5);
            const values = themeColors.filter((c) => {
                return c !== curValue;
            });
            const newValue = values[i];

            curValue = newValue;
            setTheme(newValue);
        }, 10 * 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route path={"/home"}
                           element={<HomePage/>}
                    />

                    <Route path={"/watch/:anime/:episode"}
                           element={
                               <WatchPage/>
                           }
                    />

                    <Route path={"*"}
                           element={
                               <Navigate to={"/home"}
                                         replace={true}
                               />
                           }
                    />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
