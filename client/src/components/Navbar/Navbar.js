import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { UserContext } from "../../App";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import ExploreOutlinedIcon from "@material-ui/icons/ExploreOutlined";
import ExploreIcon from "@material-ui/icons/Explore";
import SearchIcon from "@material-ui/icons/Search";
import Avatar from "@material-ui/core/Avatar";
import { InputBase, Button, Menu, MenuItem } from "@material-ui/core";

import { Link, useHistory, useLocation } from "react-router-dom";
import { api } from "../helper";

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl2, setAnchorEl2] = useState(null);
    const history = useHistory();
    const { state, dispatch } = useContext(UserContext);
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [path, setPath] = useState("/");

    const location = useLocation();

    useEffect(() => {
        setPath(location.pathname);
    }, [location]);

    const handleOpen = (event) => {
        setAnchorEl2(event.target);
    };

    const handleCloseModal = () => {
        setAnchorEl2(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.target);
    };

    const handleClose = (e) => {
        setAnchorEl(null);
        const text = e.target.textContent.toLowerCase();
        if (text === "profile") {
            history.push("/profile");
        } else if (text === "create post") {
            history.push("/create");
        }
    };

    const fetchUsers = (query) => {
        setSearch(query);
        if (query.length) {
            fetch(`${api}/search-user`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    query
                })
            })
                .then((res) => res.json())
                .then((result) => {
                    setUsers(result.user);
                });
        } else {
            setUsers([]);
        }
    };

    const renderList = () => {
        if (state) {
            return [
                <Link to='/' key='1'>
                    {path === "/" ? <HomeRoundedIcon /> : <HomeOutlinedIcon />}
                </Link>,
                <Link to='/explore' key='2'>
                    {path === "/explore" ? (
                        <ExploreIcon className='explore' />
                    ) : (
                        <ExploreOutlinedIcon className='explore' />
                    )}
                </Link>,
                <Button
                    style={{ padding: 0, minWidth: "unset" }}
                    key='3'
                    aria-controls='profile-menu'
                    aria-haspopup='true'
                    onClick={handleClick}>
                    <Avatar src={state.pic} alt={state.name} />
                </Button>,
                <Menu
                    key='4'
                    id='profile-menu'
                    anchorEl={anchorEl}
                    keepMounted
                    style={{ top: "50px" }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}>
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>Create Post</MenuItem>
                    <MenuItem
                        onClick={(e) => {
                            localStorage.clear();
                            dispatch({ type: "CLEAR" });
                            history.push("/login");
                            handleClose(e);
                        }}
                        style={{ borderTop: "1px solid #c7c7c7" }}>
                        Logout
                    </MenuItem>
                </Menu>
            ];
        } else {
            return [
                <Link key='5' to='/login'>
                    Login
                </Link>,
                <Link key='6' to='/signup'>
                    Sign Up
                </Link>
            ];
        }
    };

    return (
        <Wrapper>
            <div className='nav-left'>
                <Link to='/'>
                    <img
                        src='https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png'
                        alt='logo'
                    />
                </Link>
            </div>
            <div className='nav-center'>
                <div className='search' aria-controls='users-menu'>
                    <div className='searchIcon'>
                        <SearchIcon />
                    </div>
                    <InputBase
                        className='searchInput'
                        placeholder='Search…'
                        inputProps={{ "aria-label": "search" }}
                        disabled={state ? false : true}
                        value={search}
                        onChange={(e) => {
                            fetchUsers(e.target.value);
                            handleOpen(e);
                        }}
                    />
                </div>
                {users.length > 0 && (
                    <Menu
                        key='4'
                        id='users-menu'
                        anchorEl={anchorEl2}
                        keepMounted
                        hideBackdrop
                        disableScrollLock
                        disableAutoFocus={true}
                        disableEnforceFocus={true}
                        style={{ top: "50px" }}
                        open={Boolean(anchorEl2)}
                        onClose={handleClose}>
                        {users.map((user) => (
                            <MenuItem key={user._id} onClick={handleCloseModal}>
                                <Link
                                    to={
                                        user._id === state._id
                                            ? "/profile"
                                            : `/profile/${user._id}`
                                    }>
                                    {user.email}
                                </Link>
                            </MenuItem>
                        ))}
                    </Menu>
                )}
            </div>
            <div className='nav-right'>{renderList()}</div>
        </Wrapper>
    );
};

const Wrapper = styled.nav`
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 20px;
    height: 65px;
    border-bottom: 1px solid #dbdbdb;
    position: fixed;
    width: 100%;
    background: #fff;
    z-index: 1;
    top: 0;
    left: 0;

    .nav-left {
        img {
            height: 40px;
        }
    }

    .modal {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .paper {
        border: 2px solid #000;
    }

    .nav-center {
        .search {
            position: relative;
            border-radius: 4px;
            width: 100%;
            background: #fafafa;
            border: 1px solid #dbdbdb;
            color: #8e8e8e;

            .searchIcon {
                height: 100%;
                position: absolute;
                pointer-events: none;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .searchInput {
                padding-left: 2rem;
                width: 100%;
            }
        }
    }

    .nav-right {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 150px;

        a:hover,
        a:visited {
            text-decoration: none;
            color: inherit;
        }

        svg {
            fill: #000;
            font-size: 2rem;
        }

        .explore {
            font-size: 1.7rem;
        }

        .MuiPopover-paper {
            top: 50px;

            .MuiList-root.MuiMenu-list.MuiList-padding a:hover,
            .MuiList-root.MuiMenu-list.MuiList-padding a:visited {
                text-decoration: none;
                color: inherit;
            }
        }
        .MuiAvatar-root {
            height: 1.7rem;
            width: 1.7rem;
        }
    }
`;

export default Navbar;
