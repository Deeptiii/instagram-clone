import React, { useEffect, useState, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

function Signup() {
    const history = useHistory();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(undefined);

    const uploadFields = useCallback(() => {
        if (
            !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                email
            )
        ) {
            M.toast({ html: "Invalid email", classes: "#f44336 red" });
            return;
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                pic: url
            })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.error) {
                    M.toast({ html: data.error, classes: "#f44336 red" });
                } else {
                    M.toast({
                        html: data.message,
                        classes: "#673ab7 deep-purple"
                    });
                    history.push("/signin");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [email, history, name, password, url]);

    useEffect(() => {
        if (url) {
            uploadFields();
        }
    }, [url, uploadFields]);

    const postData = () => {
        if (image) {
            uploadProfilePic();
        } else {
            uploadFields();
        }
    };

    const uploadProfilePic = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta_clone");
        data.append("cloud_name", "deeptii");

        fetch("https://api.cloudinary.com/v1_1/deeptii/image/upload", {
            method: "post",
            body: data
        })
            .then((res) => res.json())
            .then((data) => {
                setUrl(data.url);
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
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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
                <div className="file-field">
                    <div className="btn #2196f3 blue">
                        <span>Upload Profile Picture</span>
                        <input
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button
                    className="btn waves-effect waves-light #2196f3 blue"
                    onClick={() => postData()}
                >
                    Signup
                </button>
                <h5>
                    <Link to="/signin">Already have an account?</Link>
                </h5>
            </div>
        </div>
    );
}

export default Signup;
