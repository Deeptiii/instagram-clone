import React, { useEffect, useState, useContext } from "react";
import "./Profile.css";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

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
        <>
            {!userProfile ? (
                <h2>Loading</h2>
            ) : (
                <div className="profile">
                    <div className="profile__header">
                        <div className="profile__avatar">
                            <img
                                style={{
                                    width: "160px",
                                    height: "160px",
                                    borderRadius: "50%"
                                }}
                                src={userProfile.user.pic}
                                alt=""
                            />
                        </div>
                        <div className="profile__info">
                            <h4>{userProfile.user.name}</h4>
                            <h5>{userProfile.user.email}</h5>
                            <div className="profile__infoDetails">
                                <h6>{userProfile.posts.length} Posts</h6>
                                <h6>
                                    {userProfile.user.followers.length}{" "}
                                    Followers
                                </h6>
                                <h6>
                                    {userProfile.user.following.length}{" "}
                                    Following
                                </h6>
                            </div>
                            <button
                                className="btn waves-effect waves-light #2196f3 blue btn-follow"
                                onClick={() => handleFollow()}
                            >
                                {showFollow ? "Follow" : "Unfollow"}
                            </button>
                        </div>
                    </div>
                    <div className="gallery">
                        {userProfile.posts.map((item) => (
                            <img
                                key={item._id}
                                className="item"
                                src={item.photo}
                                alt={item.title}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default UserProfile;
