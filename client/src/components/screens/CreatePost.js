import React, { useEffect, useState } from "react";
import "./CreatePost.css";
import M from "materialize-css";
import { useHistory } from "react-router-dom";

function CreatePost() {
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const history = useHistory();

    useEffect(() => {
        if (url) {
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    body,
                    pic: url
                })
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        M.toast({ html: data.error, classes: "#f44336 red" });
                    } else {
                        M.toast({
                            html: "Post created successfully!",
                            classes: "#673ab7 deep-purple"
                        });
                        history.push("/");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [url, body, history]);

    const postDetails = () => {
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
        <div className="card input-field">
            <div className="file-field">
                <div className="btn #2196f3 blue">
                    <span>Upload Image</span>
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <input
                type="text"
                placeholder="Caption"
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            <button
                className="btn waves-effect waves-light #2196f3 blue"
                onClick={() => postDetails()}
            >
                Submit Post
            </button>
        </div>
    );
}

export default CreatePost;
