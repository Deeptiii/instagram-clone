import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import BigImg from "../../assets/BigImg.png";
import styled from "styled-components";
import { UserContext } from "../../App";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const Login = () => {
    const dispatch = useContext(UserContext).dispatch;

    const histoy = useHistory();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const postData = () => {
        if (
            !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                email
            )
        ) {
            // M.toast({ html: "Invalid email", classes: "#f44336 red" });
            return;
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    localStorage.setItem("jwt", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    dispatch({ type: "SET_USER", payload: data.user });
                    // M.toast({
                    //     html: "Signed in successfully!",
                    //     classes: "#673ab7 deep-purple"
                    // });
                    histoy.push("/");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Wrapper>
            <div className='image-container'>
                <img src={BigImg} alt='BigImg' />
            </div>
            <div>
                <div className='form-container form-border'>
                    <form
                        className='form-fields-container'
                        onSubmit={(e) => {
                            e.preventDefault();
                            postData();
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
                                postData();
                            }}>
                            Login
                        </Button>
                    </form>
                </div>
                <div className='form_footer form-border'>
                    Don't have an account? <Link to='/signup'>Sign Up</Link>
                </div>
            </div>
        </Wrapper>
    );
};

export const Wrapper = styled.main`
    display: flex;
    background: #f7f7f7;
    justify-content: center;
    height: 100vh;
    min-height: 500px;

    .image-container {
        height: inherit;

        img {
            height: inherit;
        }
    }

    .form-border {
        border: 1px solid #dbdbdb;
        background: #fff;
    }

    .form_footer {
        margin: 30px 0px;
        padding: 20px;
    }
    .form-container {
        margin: 30px 0px;
        height: fit-content;
        padding: 20px;
        flex-direction: column;
        display: flex;

        .form-fields-container {
            display: flex;
            flex-direction: column;

            .MuiFormControl-root,
            .MuiButtonBase-root {
                margin: 20px 20px 10px 20px;
            }
        }
    }

    .preview-image {
        width: 300px;
    }

    .form-header {
        color: #8e8e8e;
        font-size: 17px;
        font-weight: 600;
        line-height: 20px;
        margin: 0 40px 10px;
        text-align: center;
        padding-top: 20px;
    }
    @media (max-width: 870px) {
        .image-container {
            display: none;
        }
    }
`;
export default Login;
