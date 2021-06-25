import React, { useContext, useEffect, useRef, useState } from 'react'
import './Navbar.css'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

function Navbar() {
    const searchModal= useRef(null)
    const history = useHistory()
    const { state, dispatch} = useContext(UserContext)
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])

    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])

    const renderList =() => {
        if(state) {
            return [
            <li key="1"><i data-target="modal1" className="large material-icons modal-trigger"
            style={{color:"black"}}>
                search
            </i></li>,
            <li key="2"><Link to="/profile">Profile</Link></li>,
            <li key="3"><Link to="/create">Create Post</Link></li>,
            <li key="4"><Link to="/myfollowingposts">My Following Posts</Link></li>,
            <li key="5">
                <button className="btn #2196f3 blue"
                onClick={()=>{
                    localStorage.clear()
                    dispatch({type:"CLEAR"})
                    history.push('/signin')
                }}>
                    Sign Out                    
                </button>
            </li>,
            ]
        } else{
            return [
                <li key="6"><Link to="/signin">Signin</Link></li>,
                <li key="7"><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    const fetchUsers = (query) =>{
        setSearch(query)
        fetch('/search-user',{
            method:"post",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                query
            })
        }).then(res=> res.json())
        .then(result => {
            console.log(result)
            setUsers(result.user)
        })
    }

    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state?"/":'/signin'} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
            <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
                <div className="modal-content">
                    <input 
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={e=>fetchUsers(e.target.value)}
                    />
                    <ul className="collection">
                        {users.map(item=>{
                           return <Link key={item._id} to={item._id === state._id ?'/profile':`/profile/${item._id}`} onClick={()=>{
                               M.Modal.getInstance(searchModal.current).close()
                               setSearch('')
                               setUsers([])
                           }}><li className="collection-item">{item.email}</li></Link> 
                        })}
                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>{setSearch(''); setUsers([])}}>Close</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
