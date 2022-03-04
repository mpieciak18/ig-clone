import './other.css'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NewPost } from './NewPost.js'
import { useEffect } from 'react'
import LogoSolid from '../../assets/images/ig-logo-4.png'
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
import { SettingsPopup } from './SettingsPopup.js'

const Navbar = (props) => {
    const { user } = props

    const navigate = useNavigate()

    const path = useLocation().pathname

    // Init settings pop-up visibility state
    const [viewSettings, setViewSettings] = useState(false)

    // Init new-post pop-up visibility state
    const [viewNewPost, setViewNewPost] = useState(false)

    // Init notifications pop-up visibility state
    const [viewNotif, setViewNotif] = useState(false)

    // Init navbar buttons
    const [home, setHome] = useState(HomeHollow)
    const [messages, setMessages] = useState(MessagesHollow)
    const [post, setPost] = useState(PostHollow)
    const [notifications, setNotifications] = useState(NotificationsHollow)
    const [settings, setSettings] = useState(SettingsHollow)

    const performSearch = (e) => {
        //
    }

    // Update viewNewPost (or redirect to sign-up page)
    const clickNewPost = () => {
        if (user == null) {
            navigate('/signup', {state: {path: path}})
        } else {
            setViewNewPost(true)
        }
    }

    // Update viewNotif (or redirect to sign-up page)
    const clickNotifications = () => {
        if (user == null) {
            navigate('/signup', {state: {path: path}})
        } else {
            setViewNotif(true)
        }
    }

    // Navigate to direct messages (or sign-up page)
    const clickMessages = () => {
        if (user == null) {
            navigate('/signup', {state: {path: path}})
        } else {
            navigate('/messages')
        }
    }

    // Update viewSettings (or redirect to sign-up page)
    const clickSettings = () => {
        if (user == null) {
            navigate('/signup', {state: {path: path}})
        } else if (viewSettings == false) {
            setViewSettings(true)
        } else {
            setViewSettings(false)
        }
    }

    return (
        <div id="navbar">
            <NewPost user={user} viewNewPost={viewNewPost} setViewNewPost={setViewNewPost} />
            <img id="navbar-logo"
                src={LogoSolid}
                onClick={() => navigate('/')}
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
                    onClick={clickNewPost} 
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
                <div id='settings-button-container'>
                    <img id="settings-button" 
                        src={settings} 
                        onClick={clickSettings}
                        onMouseDown={() => setSettings(SettingsSolid)}
                        onMouseUp={() => setSettings(SettingsHollow)}
                        onMouseOver={() => setSettings(SettingsSolid)}
                        onMouseOut={() => setSettings(SettingsHollow)}
                    />
                    <SettingsPopup user={user} viewSettings={viewSettings} setViewSettings={setViewSettings} />
                </div>
            </div>
        </div>
    )
}

export { Navbar }