import { TextField, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
// import "./CreatePost.css";
import { useHistory } from "react-router-dom";

import { Wrapper } from "../Authentication/Login";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { defaultAlertState, api } from "../helper";

function CreatePost() {
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [previewImage, setpreviewImage] = useState();
    const [url, setUrl] = useState("");
    const history = useHistory();
    const [showSnackbar, setShowSnackbar] = useState(defaultAlertState);

    useEffect(() => {
        if (url) {
            fetch(`${api}/createpost`, {
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
                        setShowSnackbar({
                            show: true,
                            message: data.error,
                            severity: "error"
                        });
                    } else {
                        setShowSnackbar({
                            show: true,
                            message: "Post created successfully",
                            severity: "info"
                        });
                        history.push("/");
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setShowSnackbar({
                        show: true,
                        message: "There's some error",
                        severity: "error"
                    });
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
                console.error(err);
                setShowSnackbar({
                    show: true,
                    message: "There's some error",
                    severity: "error"
                });
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
}

// const Wrapper = styled.div`
//     margin-top: 65px;
// `;

export default CreatePost;
