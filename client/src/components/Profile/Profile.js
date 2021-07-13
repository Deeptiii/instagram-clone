import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../App";
import styled from "styled-components";
import { api } from "../helper";

import { Avatar, Button } from "@material-ui/core";

const Profile = () => {
    const [mypics, setPics] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const [image, setImage] = useState("");

    useEffect(() => {
        fetch(`${api}/myposts`, {
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
                    fetch(`${api}/updatepic`, {
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
                        });
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [image]);

    const uploadProfilePic = (file) => {
        setImage(file);
    };
    return (
        <Wrapper>
            <div className='profile'>
                <div className='profile__header'>
                    <div className='profile__avatar'>
                        <Button component='label'>
                            <input
                                accept='image/*'
                                type='file'
                                hidden
                                onChange={(e) =>
                                    uploadProfilePic(e.target.files[0])
                                }
                            />
                            <Avatar
                                title='Change Profile Photo'
                                src={state ? state.pic : "loading..."}
                                alt=''
                            />
                        </Button>
                    </div>
                    <div className='profile__info'>
                        <span className='profile_name'>
                            {state ? state.name : "loading"}
                        </span>
                        <ul className='profile__infoDetails'>
                            <li className='info-item'>
                                <span>
                                    <span className='info-item-value'>
                                        {" "}
                                        {mypics.length}{" "}
                                    </span>
                                    Posts
                                </span>
                            </li>
                            <li className='info-item'>
                                <span>
                                    <span className='info-item-value'>
                                        {" "}
                                        {state?.followers.length}{" "}
                                    </span>
                                    Followers
                                </span>
                            </li>
                            <li className='info-item'>
                                <span>
                                    <span className='info-item-value'>
                                        {state?.following.length}{" "}
                                    </span>
                                    Following
                                </span>
                            </li>
                        </ul>
                        <div className='info-mail'>
                            <span>{state ? state.email : "loading"}</span>
                        </div>
                    </div>
                </div>
                <div className='gallery-container'>
                    <div className='gallery'>
                        {mypics.map((item) => (
                            <img
                                key={item._id}
                                className='item'
                                src={item.photo}
                                alt={item.title}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export const Wrapper = styled.main`
    margin-top: 65px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        Helvetica, Arial, sans-serif;
    background: #fafafa;
    .profile {
        padding: 30px 20px 0;
        margin: 20px 30px;

        .profile__header {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 45px;
            height: 150px;

            .profile__avatar {
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 0.35;

                .MuiAvatar-root {
                    height: 150px;
                    width: 150px;
                    cursor: pointer;
                }
            }

            .profile__avatar > button {
                width: fit-content;
            }

            .profile__info {
                flex: 0.65;
                height: inherit;

                .profile_info_header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .profile_name {
                    font-size: 2rem;
                    font-weight: 300;
                    color: #262626;

                    margin-right: 30px;
                }

                .info-mail {
                    font-size: 18px;
                    line-height: 24px;
                    word-wrap: break-word;

                    span {
                        font-weight: 600;
                    }
                }

                .profile__infoDetails {
                    display: flex;
                    list-style: none;
                    padding: 0;

                    .info-item {
                        margin-right: 40px;

                        .info-item-value {
                            color: #262626;
                            font-weight: 600;
                        }
                    }
                }
            }
        }
    }

    .gallery-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .gallery {
        max-width: 940px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem 1.5rem;

        .item {
            height: 293px;
            width: 293px;
        }
    }

    .item {
        width: 30%;
    }

    .btn-follow {
        margin: 10px;
    }
    @media (max-width: 992px) {
        .gallery {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 550px) {
        .gallery {
            grid-template-columns: repeat(1, 1fr);
        }
    }
`;

export default Profile;
