import { TextField, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
// import "./CreatePost.css";
import { useHistory } from "react-router-dom";

import { Wrapper } from "../Authentication/Login";

function CreatePost() {
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [previewImage, setpreviewImage] = useState();
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
                        // M.toast({ html: data.error, classes: "#f44336 red" });
                        console.log(data.error);
                    } else {
                        // M.toast({
                        //     html: "Post created successfully!",
                        //     classes: "#673ab7 deep-purple"
                        // });
                        console.log("Post created successfully");
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

    useEffect(() => {
        if (!image) {
            setpreviewImage(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(image);
        setpreviewImage(objectUrl);
        return () => URL.revokeObjectURL;
    }, [image]);

    return (
        <Wrapper className='marginTop'>
            <div className='form-container form-border'>
                <form className='form-fields-container'>
                    <h2 className='form-header'>Create Post</h2>
                    <div className='file-field'>
                        <Button variant='contained' component='label'>
                            Upload File
                            <input
                                accept='image/*'
                                type='file'
                                hidden
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </Button>
                    </div>
                    {previewImage && (
                        <img
                            className='preview-image'
                            src={previewImage}
                            alt=''
                        />
                    )}
                    <TextField
                        type='text'
                        label='Caption'
                        variant='outlined'
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                    <Button
                        variant='contained'
                        color='primary'
                        type='submit'
                        onClick={(e) => {
                            e.preventDefault();
                            postDetails();
                        }}>
                        Submit Post
                    </Button>
                </form>
            </div>
        </Wrapper>
    );
}

// const Wrapper = styled.div`
//     margin-top: 65px;
// `;

export default CreatePost;
