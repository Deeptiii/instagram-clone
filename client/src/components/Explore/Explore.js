import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

import { Avatar } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";

import { Wrapper } from "../Home/Home";

import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { defaultAlertState, api } from "../helper";

const Explore = () => {
    const [data, setData] = useState([]);
    const [left, setLeft] = useState(174 + 616);
    const state = useContext(UserContext).state;
    const [showSnackbar, setShowSnackbar] = useState(defaultAlertState);

    useEffect(() => {
        fetch(`${api}/allposts`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then((res) => res.json())
            .then((res) => {
                setData(res.posts);
            });
    }, []);

    const likePost = (id) => {
        fetch(`${api}/like`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        })
            .then((res) => res.json())
            .then((res) => {
                const newData = data.map((item) => {
                    if (item._id === res._id) {
                        return res;
                    } else {
                        return item;
                    }
                });
                setData(newData);
            })
            .catch((err) => {
                console.error(err);
                setShowSnackbar({
                    show: true,
                    message: "There's some error",
                    severity: "error"
                });
            });
    };

    const unlikePost = (id) => {
        fetch(`${api}/unlike`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        })
            .then((res) => res.json())
            .then((res) => {
                const newData = data.map((item) => {
                    if (item._id === res._id) {
                        return res;
                    } else {
                        return item;
                    }
                });
                setData(newData);
            })
            .catch((err) => {
                console.error(err);
                setShowSnackbar({
                    show: true,
                    message: "There's some error",
                    severity: "error"
                });
            });
    };

    const makeComment = (text, postId) => {
        fetch(`${api}/comment`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        })
            .then((res) => res.json())
            .then((res) => {
                const newData = data.map((item) => {
                    if (item._id === res._id) {
                        return res;
                    } else {
                        return item;
                    }
                });
                setData(newData);
            })
            .catch((err) => {
                console.error(err);
                setShowSnackbar({
                    show: true,
                    message: "There's some error",
                    severity: "error"
                });
            });
    };

    const deletePost = (postId) => {
        fetch(`${api}/deletepost/${postId}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then((res) => res.json())
            .then((res) => {
                const newData = data.filter((item) => {
                    return item._id !== res._id;
                });
                setData(newData);
                setShowSnackbar({
                    show: true,
                    message: "Post deleted successfully",
                    severity: "info"
                });
            })
            .catch((err) => {
                console.error(err);
                setShowSnackbar({
                    show: true,
                    message: "There's some error",
                    severity: "error"
                });
            });
    };

    const deleteComment = (postId, commentId) => {
        fetch(`${api}/deletecomment/${postId}/${commentId}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then((res) => res.json())
            .then((res) => {
                const newData = data.map((item) => {
                    if (item._id === res._id) {
                        return res;
                    } else {
                        return item;
                    }
                });
                setData(newData);
            })
            .catch((err) => {
                console.error(err);
                setShowSnackbar({
                    show: true,
                    message: "There's some error",
                    severity: "error"
                });
            });
    };

    const handleResize = () => {
        let l = document.getElementsByClassName("posts-list");
        if (l.length) {
            l = l[0].getBoundingClientRect();
            setLeft(l.left + l.width);
        }
    };

    window.addEventListener("resize", handleResize);
    return (
        <Wrapper>
            <section className='posts-list'>
                {data.map((item) => (
                    <article className='card home-card' key={item._id}>
                        <div className='card-header'>
                            <Avatar src={item.postedBy.pic} />
                            <h5>
                                <Link
                                    to={
                                        item.postedBy._id === state._id
                                            ? "/profile"
                                            : `/profile/${item.postedBy._id}`
                                    }>
                                    {item.postedBy.name}
                                </Link>
                                {item.postedBy._id === state._id && (
                                    <DeleteIcon
                                        style={{ float: "right" }}
                                        onClick={(e) => {
                                            deletePost(item._id);
                                        }}
                                    />
                                )}
                            </h5>
                        </div>
                        <div className='card-image'>
                            <img src={item.photo} alt='' />
                        </div>

                        <div className='card-content'>
                            <IconButton
                                style={
                                    item.likes.includes(state._id)
                                        ? { color: "red" }
                                        : { color: "black" }
                                }
                                onClick={() => {
                                    item.likes.includes(state._id)
                                        ? unlikePost(item._id)
                                        : likePost(item._id);
                                }}>
                                {item.likes.includes(state._id) ? (
                                    <FavoriteRoundedIcon />
                                ) : (
                                    <FavoriteBorderIcon />
                                )}
                            </IconButton>

                            <section className='likes-count'>
                                <strong>{item.likes.length}</strong> Likes
                            </section>
                            <div className='caption'>
                                <strong>{item.postedBy.name}</strong>{" "}
                                {item.body}
                            </div>
                            <div className='comments-container'>
                                {item.comments.map((record) => {
                                    return (
                                        <div
                                            className='comment-record'
                                            key={record._id}>
                                            <span className='comment-record-item'>
                                                <strong className='comment-record-name'>
                                                    {record.postedBy.name}{" "}
                                                </strong>
                                                {record.text}
                                            </span>

                                            {record.postedBy._id ===
                                                state._id && (
                                                <DeleteIcon
                                                    style={{ float: "right" }}
                                                    onClick={(e) => {
                                                        deleteComment(
                                                            item._id,
                                                            record._id
                                                        );
                                                    }}></DeleteIcon>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <form
                                action=''
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    makeComment(e.target[0].value, item._id);
                                    e.target[0].value = "";
                                }}>
                                <input
                                    aria-label='Add a comment…'
                                    placeholder='Add a comment…'
                                    autoComplete='off'
                                    autoCorrect='off'></input>
                            </form>
                        </div>
                    </article>
                ))}
            </section>
            <section className='profile-details' style={{ left: left }}>
                {state && (
                    <div className='profile-container'>
                        <Link to='/profile'>
                            <div className='profile-header'>
                                <Avatar src={state.pic} />
                                <span className='profile-name'>
                                    <strong style={{ whiteSpace: "nowrap" }}>
                                        {" "}
                                        {state.name}
                                    </strong>
                                    {state.email}
                                </span>
                            </div>
                        </Link>
                    </div>
                )}

                <footer>
                    <ul>
                        <li>
                            <span className='footer-span'>About</span>
                        </li>
                        <li>
                            {" "}
                            <span>Help</span>{" "}
                        </li>
                        <li>
                            {" "}
                            <span>Press</span>{" "}
                        </li>
                        <li>
                            {" "}
                            <span>API</span>{" "}
                        </li>
                        <li>
                            {" "}
                            <span>Jobs</span>{" "}
                        </li>
                        <li>
                            {" "}
                            <span>Privacy</span>{" "}
                        </li>
                        <li>
                            {" "}
                            <span>Terms</span>{" "}
                        </li>
                        <li>
                            {" "}
                            <span>Locations</span>{" "}
                        </li>
                        <li>
                            {" "}
                            <span>Top Accounts</span>{" "}
                        </li>
                        <li>
                            {" "}
                            <span>Hashtags</span>{" "}
                        </li>
                        <li>
                            {" "}
                            <span>API</span>{" "}
                        </li>
                    </ul>
                </footer>
            </section>
            {showSnackbar.show && (
                <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    open={showSnackbar.show}
                    autoHideDuration={6000}
                    onClose={() => setShowSnackbar(defaultAlertState)}
                    key='bottomright'>
                    <Alert
                        severity={showSnackbar.severity}
                        onClose={() => setShowSnackbar(defaultAlertState)}>
                        {showSnackbar.message}
                    </Alert>
                </Snackbar>
            )}
        </Wrapper>
    );
};

export default Explore;
