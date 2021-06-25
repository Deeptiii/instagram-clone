import React, { useEffect, createContext, useReducer, useContext } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "./components/screens/Home";
import SubscribedUserPosts from "./components/screens/SubscribedUserPosts";
import Signin from "./components/screens/Signin";
import Profile from "./components/screens/Profile";
import UserProfile from "./components/screens/UserProfile";
import Signup from "./components/screens/Signup";
import CreatePost from "./components/screens/CreatePost";
import { reducer, initialState } from "./reducers/userReducer";

export const UserContext = createContext();

const Routing = () => {
    const history = useHistory();
    const dispatch = useContext(UserContext).dispatch;

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            dispatch({ type: "SET_USER", payload: user });
        } else {
            history.push("/signin");
        }
    }, [history, dispatch]);

    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>

            <Route path="/signup">
                <Signup />
            </Route>

            <Route path="/signin">
                <Signin />
            </Route>

            <Route exact path="/profile">
                <Profile />
            </Route>

            <Route path="/profile/:userid">
                <UserProfile />
            </Route>

            <Route path="/create">
                <CreatePost />
            </Route>

            <Route path="/myfollowingposts">
                <SubscribedUserPosts />
            </Route>
        </Switch>
    );
};

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <UserContext.Provider value={{ state, dispatch }}>
            <BrowserRouter>
                <Navbar />
                <Routing />
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;
