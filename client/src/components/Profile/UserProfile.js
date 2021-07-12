import React, { useEffect, useState, useContext } from "react";
// import "./Profile.css";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import { Wrapper } from "./Profile";
import { Avatar, Button } from "@material-ui/core";

function UserProfile() {
    const [userProfile, setProfile] = useState(null);
    const [showFollow, setShowFollow] = useState(true);

    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams();

    useEffect(() => {
        if (state && userProfile) {
            if (userProfile.user.followers.includes(state._id)) {
                setShowFollow(false);
            } else {
                setShowFollow(true);
            }
        }
    }, [state, userProfile]);

    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then((res) => res.json())
            .then((res) => {
                setProfile(res);
            });
    }, [userid]);

    const followUser = () => {
        fetch("/follow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        })
            .then((res) => res.json())
            .then((data) => {
                dispatch({
                    type: "UPDATE",
                    payload: {
                        followers: data.followers,
                        following: data.following
                    }
                });
                localStorage.setItem("user", JSON.stringify(data));
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    };
                });
                setShowFollow(false);
            });
    };
    const unfollowUser = () => {
        fetch("/unfollow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        })
            .then((res) => res.json())
            .then((data) => {
                dispatch({
                    type: "UPDATE",
                    payload: {
                        followers: data.followers,
                        following: data.following
                    }
                });
                localStorage.setItem("user", JSON.stringify(data));
                setProfile((prevState) => {
                    const newFollowers = prevState.user.followers.filter(
                        (item) => item !== data._id
                    );
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollowers
                        }
                    };
                });
                setShowFollow(true);
            });
    };

    const handleFollow = () => {
        showFollow ? followUser() : unfollowUser();
    };

    return (
        <Wrapper>
            {!userProfile ? (
                <h2>Loading</h2>
            ) : (
                <div className='profile'>
                    <div className='profile__header'>
                        <div className='profile__avatar'>
                            <Avatar src={userProfile.user.pic} alt='' />
                        </div>
                        <div className='profile__info'>
                            <div className='profile_info_header'>
                                <span className='profile_name'>
                                    {userProfile.user.name}
                                </span>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    onClick={() => handleFollow()}>
                                    {showFollow ? "Follow" : "Unfollow"}
                                </Button>
                            </div>

                            <ul className='profile__infoDetails'>
                                <li className='info-item'>
                                    <span>
                                        <span className='info-item-value'>
                                            {" "}
                                            {userProfile.posts.length}{" "}
                                        </span>
                                        Posts
                                    </span>
                                </li>
                                <li className='info-item'>
                                    <span>
                                        <span className='info-item-value'>
                                            {" "}
                                            {
                                                userProfile.user.followers
                                                    .length
                                            }{" "}
                                        </span>
                                        Followers
                                    </span>
                                </li>
                                <li className='info-item'>
                                    <span>
                                        <span className='info-item-value'>
                                            {" "}
                                            {
                                                userProfile.user.following
                                                    .length
                                            }{" "}
                                        </span>
                                        Following
                                    </span>
                                </li>
                            </ul>
                            <div className='info-mail'>
                                <span>{userProfile.user.email}</span>
                            </div>
                        </div>
                    </div>
                    <div className='gallery'>
                        {userProfile.posts.map((item) => (
                            <img
                                key={item._id}
                                className='item'
                                src={item.photo}
                                alt={item.title}
                            />
                        ))}
                    </div>
                </div>
            )}
        </Wrapper>
    );
}

export default UserProfile;
