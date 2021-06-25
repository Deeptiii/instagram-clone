import React, { useEffect, useState, useContext } from "react";
import "./Profile.css";
import { UserContext } from "../../App";

function Profile() {
    const [mypics, setPics] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const [image, setImage] = useState("");

    useEffect(() => {
        fetch("/myposts", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then((res) => res.json())
            .then((res) => {
                setPics(res.myposts);
            });
    }, []);

    useEffect(() => {
        if (image) {
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
                    fetch("/updatepic", {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization:
                                "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    })
                        .then((res) => res.json())
                        .then((result) => {
                            localStorage.setItem(
                                "user",
                                JSON.stringify({ ...state, pic: result.pic })
                            );
                            dispatch({
                                type: "UPDATEPIC",
                                payload: result.pic
                            });
                            console.log(result);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [image, state, dispatch]);

    const uploadProfilePic = (file) => {
        setImage(file);
    };

    return (
        <div className="profile">
            <div className="profile__header">
                <div className="profile__avatar">
                    <img
                        style={{
                            width: "160px",
                            height: "160px",
                            borderRadius: "50%"
                        }}
                        src={state ? state.pic : "loading..."}
                        alt=""
                    />
                    <div className="file-field">
                        <div className="btn #2196f3 blue">
                            <span>Upload Profile Picture</span>
                            <input
                                type="file"
                                onChange={(e) =>
                                    uploadProfilePic(e.target.files[0])
                                }
                            />
                        </div>
                        <div className="file-path-wrapper">
                            <input
                                style={{ display: "none" }}
                                className="file-path validate"
                                type="text"
                            />
                        </div>
                    </div>
                </div>
                <div className="profile__info">
                    <h4>{state ? state.name : "loading"}</h4>
                    <h5>{state ? state.email : "loading"}</h5>
                    <div className="profile__infoDetails">
                        <h6>{mypics.length} Posts</h6>
                        <h6>{state?.followers.length} Followers</h6>
                        <h6>{state?.following.length} Following</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {mypics.map((item) => (
                    <img
                        key={item._id}
                        className="item"
                        src={item.photo}
                        alt={item.title}
                    />
                ))}
            </div>
        </div>
    );
}

export default Profile;
