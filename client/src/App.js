import React, { useEffect, createContext, useReducer, useContext } from "react";

import {
    BrowserRouter as Router,
    Route,
    Switch,
    useHistory
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Explore from "./components/Explore/Explore";
import Profile from "./components/Profile/Profile";
import Login from "./components/Authentication/Login";

import { reducer, initialState } from "./reducer/userReducer";
import SignUp from "./components/Authentication/SignUp";
import UserProfile from "./components/Profile/UserProfile";
import CreatePost from "./components/CreatePost/CreatePost";
export const UserContext = createContext();

const Routing = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(UserContext);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            dispatch({ type: "SET_USER", payload: user });
        } else {
            history.push("/login");
        }
    }, []);
    return (
        <>
            {state && <Navbar />}
            <Switch>
                <Route exact path='/'>
                    <Home />
                </Route>
                <Route exact path='/login'>
                    <Login />
                </Route>
                <Route exact path='/signup'>
                    <SignUp />
                </Route>

                <Route path='/profile/:userid'>
                    <UserProfile />
                </Route>

                <Route exact path='/explore'>
                    <Explore />
                </Route>
                <Route exact path='/create'>
                    <CreatePost />
                </Route>

                <Route exact path='/profile'>
                    <Profile />
                </Route>
            </Switch>
        </>
    );
};

const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            <Router>
                <Routing />
            </Router>
        </UserContext.Provider>
    );
};

export default App;
