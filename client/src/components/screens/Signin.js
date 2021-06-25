import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";

function Signin() {
    const dispatch = useContext(UserContext).dispatch;

    const histoy = useHistory();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const postData = () => {
        if (
            !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                email
            )
        ) {
            M.toast({ html: "Invalid email", classes: "#f44336 red" });
            return;
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#f44336 red" });
                } else {
                    localStorage.setItem("jwt", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    dispatch({ type: "SET_USER", payload: data.user });
                    M.toast({
                        html: "Signed in successfully!",
                        classes: "#673ab7 deep-purple"
                    });
                    histoy.push("/");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 className="card__header"> Instagram</h2>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="btn waves-effect waves-light #2196f3 blue"
                    onClick={() => postData()}
                >
                    Signin
                </button>
                <h5>
                    <Link to="/signup">Don't have an account?</Link>
                </h5>
            </div>
        </div>
    );
}

export default Signin;
