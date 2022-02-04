import './other.css'
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { NewPost } from './NewPost.js'
import { useEffect } from 'react'

const Navbar = (props) => {
    const { user } = props

    const clickHome = () => {
        return <Navigate to='/' />
    }

    const performSearch = (e) => {
        //
    }

    const [newPostOn, setNewPostOn] = useState(false)

    const clickAddPost = () => {
        if (user.loggedIn == false) {
            const path = useLocation().pathname
            return <Navigate to='/signup' state={{path: path}} />
        } else {
            setNewPostOn(true)
        }
    }

    let newPost = null
    useEffect(() => {
        if (newPostOn != true) {
            newPost = null
        } else {
            newPost = <NewPost setNewPostOn={setNewPostOn} />
        }
    }, newPostOn)

    const renderNewPost = () => {
        if (newPostOn == true) {
            return (
                <NewPost newPostOn={newPostOn} setNewPostOn={setNewPostOn} />
            )
        } else {
            return null
        }
    }

    const clickNotifications = () => {
        const path = useLocation().pathname
        if (user.loggedIn == false) {
            return <Navigate to='/signup' state={{path: path}} />
        } else {
            return <Navigate to='/notifications' state={{path: path}} />
        }
    }
    const clickMessages = () => {
        if (user.loggedIn == false) {
            const path = useLocation().pathname
            return <Navigate to='/signup' state={{path: path}} />
        } else {
            return <Navigate to='/messages' />
        }
    }

    return (
        <div id="navbar">
            <div id="header">
                <img class="logo" />
            </div>
            <div id="footer-or-header">
                <img class="home-button" onClick={clickHome} />
                <img class="search-button" onClick={performSearch} />
                <img class="add-post-button" onClick={clickAddPost} />
                <img class="notifications-button" onClick={clickNotifications} />
                <img class="messages-button" onClick={clickMessages} />
            </div>
            {newPost}
        </div>
    )
}

export { Navbar }