import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

import styled from "styled-components";
import { Avatar, Paper } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";

const Home = () => {
    const [data, setData] = useState([]);
    const state = useContext(UserContext).state;

    useEffect(() => {
        fetch("/getsubposts", {
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
        fetch("/like", {
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
                console.log(err);
            });
    };

    const unlikePost = (id) => {
        fetch("/unlike", {
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
                console.log(err);
            });
    };

    const makeComment = (text, postId) => {
        fetch("/comment", {
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
                console.log(err);
            });
    };

    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
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
                // M.toast({
                //     html: "Post deleted successfully",
                //     classes: "#f44336 red"
                // });
                console.log("Post deleted successfully");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteComment = (postId, commentId) => {
        fetch(`/deletecomment/${postId}/${commentId}`, {
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
                console.log(err);
            });
    };
    return (
        <Wrapper>
            <section className='posts-list'>
                {data.length ? (
                    data.map((item) => (
                        <article className='card home-card' key={item._id}>
                            <div className='card-header'>
                                <Avatar src={item.postedBy.pic} />
                                <h5 className='card-header-derails'>
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
                                                        style={{
                                                            float: "right"
                                                        }}
                                                        onClick={(e) => {
                                                            deleteComment(
                                                                item._id,
                                                                record._id
                                                            );
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <form
                                    action=''
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        makeComment(
                                            e.target[0].value,
                                            item._id
                                        );
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
                    ))
                ) : state ? (
                    <Paper variant='outlined' elevation={3} className='paper'>
                        Hi, <strong> {state.name} </strong>, <br />
                        <span className='welcome'>
                            Welcome to instagram!!{" "}
                        </span>{" "}
                        <br />
                        <span>
                            To enjoy this journey with us, you can start posting
                            your pictures and to see other people's post start
                            following them from{" "}
                            <Link to='/explore'>
                                {" "}
                                <strong> Explore </strong>
                            </Link>
                            page
                        </span>
                    </Paper>
                ) : (
                    <div>Hii</div>
                )}
            </section>
            <section className='profile-details'>
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
                        <div>Suggestions</div>
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
        </Wrapper>
    );
};

export const Wrapper = styled.main`
    display: flex;
    justify-content: center;
    background: #f7f7f7;
    margin-top: 65px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        Helvetica, Arial, sans-serif;

    a:hover,
    a:visited,
    a {
        text-decoration: none;
        cursor: pointer;
        color: inherit;
    }

    .posts-list {
        margin-right: 300px;
        padding-top: 30px;
    }

    .MuiPaper-rounded {
        margin: 30px;
        width: 300px;
        padding: 50px;
        font-size: 16px;
        text-align: center;
        .welcome {
            font-weight: 600;
            font-size: 20px;
            padding: 10px;
        }
    }
    .card {
        display: flex;
        background: #fff;
        flex-direction: column;
        max-width: 614px;
        border: 1px solid #dbdbdb;
        margin-bottom: 15px;

        .card-header {
            display: flex;
            align-items: center;
            padding: 0px 20px;
            height: 50px;

            .MuiAvatar-root {
                height: 32px;
                width: 32px;
            }

            h5 {
                display: flex;
                width: 100%;
                justify-content: space-between;
                padding-left: 10px;
                &:hover {
                    text-decoration: underline;
                }

                svg {
                    cursor: pointer;
                }
            }
        }
        .card-image {
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f2f3f5;
            max-width: 614px;
            img {
                max-width: 614px;
            }
        }

        .card-content {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                Helvetica, Arial, sans-serif;
            font-size: 14px;
            .likes-count,
            .comments-container {
                padding: 0 20px;
            }
            .caption {
                padding: 5px 20px;
            }

            .comments-container {
                margin-bottom: 4px;
            }
            .comment-record {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                    Roboto, Helvetica, Arial, sans-serif;
                display: flex;
                flex-direction: column;
                padding-top: 5px;

                .comment-record-item {
                    max-width: 96%;
                    word-wrap: break-word;

                    .comment-record-name {
                        white-space: nowrap;
                    }
                }
            }

            form {
                padding: 0 20px;
                display: flex;
                height: 40px;
                border-top: 1px solid #dbdbdb;

                input {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                        Roboto, Helvetica, Arial, sans-serif;
                    flex-grow: 1;
                    resize: none;
                    border: 0;
                    outline: 0;
                }
            }
        }
    }

    .profile-details {
        flex: 0.4;
        padding-top: 30px;
        min-height: 300px;
        min-width: 300px;
        position: fixed;
        width: 300px;
        right: 40px;

        .profile-container {
            padding: 20px;
        }

        .profile-header {
            display: flex;
            align-items: center;
            margin: 10px;

            .MuiAvatar-root {
                height: 3rem;
                width: 3rem;
            }

            .profile-name {
                padding-left: 20px;
                display: flex;
                flex-direction: column;
            }
        }
    }

    footer {
        ul {
            text-decoration: none;
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            color: #c7c7c7;

            li {
                span {
                    font-size: 0.8rem;
                    padding-right: 5px;
                }
            }
        }
    }

    @media (max-width: 1000px) {
        .profile-details {
            display: none;
        }

        .posts-list {
            margin: auto 30px;
        }
    }
`;

export default Home;
