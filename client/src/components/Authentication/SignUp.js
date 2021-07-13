import React, { useState, useCallback } from "react";

import { Link, useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { Wrapper } from "./Login";

import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { defaultAlertState, api } from "../helper";

const SignUp = () => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showSnackbar, setShowSnackbar] = useState(defaultAlertState);

    const uploadFields = useCallback(() => {
        if (
            !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                email
            )
        ) {
            setShowSnackbar({
                show: true,
                message: "Invalid email",
                severity: "error"
            });
            return;
        }
        fetch(`${api}/signup`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
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
                    // M.toast({
                    //     html: data.message,
                    //     classes: "#673ab7 deep-purple"
                    // });
                    setShowSnackbar({
                        show: true,
                        message: data.message,
                        severity: "success"
                    });
                    history.push("/login");
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
    }, [email, history, name, password]);

    return (
        <Wrapper>
            <div>
                <div className='form-container form-border'>
                    <form
                        className='form-fields-container'
                        onSubmit={(e) => {
                            e.preventDefault();
                            uploadFields();
                        }}>
                        <img
                            src='https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png'
                            alt='logo'
                        />
                        <TextField
                            label='Email'
                            type='email'
                            variant='outlined'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label='Name'
                            type='text'
                            variant='outlined'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            type='password'
                            label='Password'
                            variant='outlined'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            variant='contained'
                            color='primary'
                            type='submit'
                            onClick={(e) => {
                                e.preventDefault();
                                uploadFields();
                            }}>
                            Sign Up
                        </Button>
                    </form>
                </div>
                <div className='form_footer form-border'>
                    Already have an account? <Link to='/login'>Log in</Link>
                </div>
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
};

export default SignUp;
