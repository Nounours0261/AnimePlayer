import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router";
import HomePage from "./HomePage.jsx";
import WatchPage from "./WatchPage.jsx";

function App() {

    return (
        <>
            <BrowserRouter>
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
