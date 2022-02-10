import './other.css'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NewPost } from './NewPost.js'
import { useEffect } from 'react'
import LogoSolid from '../../assets/images/ig-logo-4.png'
import LogoHollow from '../../assets/images/ig-logo-hollow.png'
import HomeHollow from '../../assets/images/home.png'
import HomeSolid from '../../assets/images/home-solid.png'
import SettingsHollow from '../../assets/images/profile.png'
import SettingsSolid from '../../assets/images/profile-solid.png'
import PostHollow from '../../assets/images/post.png'
import PostSolid from '../../assets/images/post-solid.png'
import NotificationsHollow from '../../assets/images/like.png'
import NotificationsSolid from '../../assets/images/like-solid.png'
import MessagesHollow from '../../assets/images/messages.png'
import MessagesSolid from '../../assets/images/messages-solid.png'

const Navbar = (props) => {
    // Init props, states, & other values
    const { user } = props

    const navigate = useNavigate()

    const path = useLocation().pathname

    const [newPostOn, setNewPostOn] = useState(false)

    const [logo, setLogo] = useState(LogoSolid)
    const [home, setHome] = useState(HomeHollow)
    const [messages, setMessages] = useState(MessagesHollow)
    const [post, setPost] = useState(PostHollow)
    const [notifications, setNotifications] = useState(NotificationsHollow)
    const [settings, setSettings] = useState(SettingsHollow)

    const performSearch = (e) => {
        //
    }

    const clickAddPost = () => {
        if (user == null) {
            navigate('/signup', {state: {path: path}})
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
    }, [newPostOn])

    const clickNotifications = () => {
        if (user == null) {
            return navigate('/signup', {state: {path: path}})
        } else {
            return navigate('/notifications', {state: {path: path}})
        }
    }

    const clickMessages = () => {
        if (user == null) {
            return navigate('/signup', {state: {path: path}})
        } else {
            return navigate('/messages')
        }
    }

    const clickSettings = () => {
        if (user == null) {
            return navigate('/signup', {state: {path: path}})
        } else {
            return navigate('/settings')
        }
    }

    return (
        <div id="navbar">
            {newPost}
            <img id="navbar-logo"
                src={logo}
                onClick={() => navigate('/')}
                onMouseDown={() => setLogo(LogoHollow)}
                onMouseUp={() => setLogo(LogoSolid)}
                onMouseOver={() => setLogo(LogoHollow)}
                onMouseOut={() => setLogo(LogoSolid)}
            />
            <input id="navbar-search" type='text' placeholder='Search' />
            <div id="navbar-buttons">
                <img id="home-button" 
                    src={home}
                    onClick={() => navigate('/')}
                    onMouseDown={() => setHome(HomeSolid)}
                    onMouseUp={() => setHome(HomeHollow)}
                    onMouseOver={() => setHome(HomeSolid)}
                    onMouseOut={() => setHome(HomeHollow)}
                />
                <img id="messages-button" 
                    src={messages}
                    onClick={clickMessages}
                    onMouseDown={() => setMessages(MessagesSolid)}
                    onMouseUp={() => setMessages(MessagesHollow)}
                    onMouseOver={() => setMessages(MessagesSolid)}
                    onMouseOut={() => setMessages(MessagesHollow)}
                />
                <img id="post-button" 
                    src={post} 
                    onClick={clickAddPost} 
                    onMouseDown={() => setPost(PostSolid)}
                    onMouseUp={() => setPost(PostHollow)}
                    onMouseOver={() => setPost(PostSolid)}
                    onMouseOut={() => setPost(PostHollow)}
                />
                <img id="notifications-button"
                    src={notifications}
                    onClick={clickNotifications}
                    onMouseDown={() => setNotifications(NotificationsSolid)}
                    onMouseUp={() => setNotifications(NotificationsHollow)}
                    onMouseOver={() => setNotifications(NotificationsSolid)}
                    onMouseOut={() => setNotifications(NotificationsHollow)}
                />
                <img id="settings-button" 
                    src={settings} 
                    onClick={clickSettings}
                    onMouseDown={() => setSettings(SettingsSolid)}
                    onMouseUp={() => setSettings(SettingsHollow)}
                    onMouseOver={() => setSettings(SettingsSolid)}
                    onMouseOut={() => setSettings(SettingsHollow)}
                />
            </div>
            {newPost}
        </div>
    )
}

export { Navbar }