import React, { useEffect, useState, useContext } from "react";
import "./Home.css";
import { UserContext } from "../../App";
import M from "materialize-css";
import { Link } from "react-router-dom";

function Home() {
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
                M.toast({
                    html: "Post deleted successfully",
                    classes: "#f44336 red"
                });
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
        <div className="home">
            {data.map((item) => (
                <div className="card home-card" key={item._id}>
                    <h5>
                        <Link
                            to={
                                item.postedBy._id === state._id
                                    ? "/profile"
                                    : `/profile/${item.postedBy._id}`
                            }
                        >
                            {item.postedBy.name}
                        </Link>
                        {item.postedBy._id === state._id && (
                            <i
                                className="material-icons"
                                style={{ float: "right" }}
                                onClick={(e) => {
                                    deletePost(item._id);
                                }}
                            >
                                delete
                            </i>
                        )}
                    </h5>
                    <div className="card-image">
                        <img src={item.photo} alt="" />
                    </div>

                    <div className="card-content">
                        <i
                            className="material-icons"
                            style={
                                item.likes.includes(state._id)
                                    ? { color: "red" }
                                    : { color: "black" }
                            }
                            onClick={() => {
                                item.likes.includes(state._id)
                                    ? unlikePost(item._id)
                                    : likePost(item._id);
                            }}
                        >
                            favorite
                        </i>

                        <h6>{item.likes.length} Likes</h6>
                        <h4>{item.title}</h4>
                        <p>{item.body}</p>
                        {item.comments.map((record) => {
                            return (
                                <h6 key={record._id}>
                                    <span>
                                        <b>{record.postedBy.name} </b>
                                    </span>
                                    {record.text}

                                    {record.postedBy._id === state._id && (
                                        <i
                                            className="material-icons"
                                            style={{ float: "right" }}
                                            onClick={(e) => {
                                                deleteComment(
                                                    item._id,
                                                    record._id
                                                );
                                            }}
                                        >
                                            delete
                                        </i>
                                    )}
                                </h6>
                            );
                        })}
                        <form
                            action=""
                            onSubmit={(e) => {
                                e.preventDefault();
                                makeComment(e.target[0].value, item._id);
                                e.target[0].value = "";
                            }}
                        >
                            <input type="text" placeholder="Add comment" />
                        </form>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Home;
