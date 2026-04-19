import {BrowserRouter, Navigate, Route, Routes} from "react-router";
import HomePage from "../home/HomePage.jsx";
import WatchPage from "../watch/WatchPage.jsx";
import Header from "./Header.jsx";

function App() {
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
