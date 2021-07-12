import React, { useState, useCallback } from "react";

import { Link, useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { Wrapper } from "./Login";

const SignUp = () => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const uploadFields = useCallback(() => {
        if (
            !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                email
            )
        ) {
            // M.toast({ html: "Invalid email", classes: "#f44336 red" });
            return;
        }
        fetch("/signup", {
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
                console.log(data);
                if (data.error) {
                    // M.toast({ html: data.error, classes: "#f44336 red" });
                    console.log(data.error);
                } else {
                    // M.toast({
                    //     html: data.message,
                    //     classes: "#673ab7 deep-purple"
                    // });
                    console.log("Signup suceess", data.message);
                    history.push("/login");
                }
            })
            .catch((err) => {
                console.log(err);
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
                        <h2 className='form-header'>Log In</h2>
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
        </Wrapper>
    );
};

export default SignUp;
