import './other.css'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NewPost } from './NewPost.js'
import { SettingsPopup } from './SettingsPopup.js'
import { Notifications } from './Notifications.js'
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

const Navbar = (props) => {
    const { user } = props

    const navigate = useNavigate()

    const path = useLocation().pathname

    // Init settings pop-up visibility state
    const [viewSettings, setViewSettings] = useState(false)

    // Init new-post pop-up visibility state
    const [viewNewPost, setViewNewPost] = useState(false)

    // Init notifications pop-up visibility state
    const [viewNotifs, setViewNotifs] = useState(false)

    // Init navbar buttons
    const [homeImg, setHomeImg] = useState(HomeHollow)
    const [messageImg, setMessageImg] = useState(MessagesHollow)
    const [postImg, setPostImg] = useState(PostHollow)
    const [notifImg, setNotifImg] = useState(NotificationsHollow)
    const [settingsImg, setSettingsImg] = useState(SettingsHollow)

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
        } else if (viewNotifs == false) {
            setViewNotifs(true)
        } else {
            setViewNotifs(false)
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

    // Init notifications component state
    const [notifications, setNotifications] = useState(null)

    // Update notifications state when viewNotifs changes
    useEffect(async () => {
        const body = document.querySelector('body')
        if (viewNotifs == true) {
            setNotifications(<Notifications user={user} setViewNotifs={setViewNotifs} />)
            body.style.overflow = 'hidden'
        } else {
            setNotifications(null)
            body.style.overflow = 'auto'
        }
    }, [viewNotifs])

    return (
        <div id="navbar">
            <NewPost user={user} viewNewPost={viewNewPost} setViewNewPost={setViewNewPost} />
            {notifications}
            <img id="navbar-logo"
                src={LogoSolid}
                onClick={() => navigate('/')}
            />
            <input id="navbar-search" type='text' placeholder='Search' />
            <div id="navbar-buttons">
                <img id="home-button" 
                    src={homeImg}
                    onClick={() => navigate('/')}
                    onMouseDown={() => setHomeImg(HomeSolid)}
                    onMouseUp={() => setHomeImg(HomeHollow)}
                    onMouseOver={() => setHomeImg(HomeSolid)}
                    onMouseOut={() => setHomeImg(HomeHollow)}
                />
                <img id="messages-button" 
                    src={messageImg}
                    onClick={clickMessages}
                    onMouseDown={() => setMessageImg(MessagesSolid)}
                    onMouseUp={() => setMessageImg(MessagesHollow)}
                    onMouseOver={() => setMessageImg(MessagesSolid)}
                    onMouseOut={() => setMessageImg(MessagesHollow)}
                />
                <img id="post-button" 
                    src={postImg} 
                    onClick={clickNewPost} 
                    onMouseDown={() => setPostImg(PostSolid)}
                    onMouseUp={() => setPostImg(PostHollow)}
                    onMouseOver={() => setPostImg(PostSolid)}
                    onMouseOut={() => setPostImg(PostHollow)}
                />
                <div id='notifications-button-container'>
                    <img id="notifications-button"
                        src={notifImg}
                        onClick={clickNotifications}
                        onMouseDown={() => setNotifImg(NotificationsSolid)}
                        onMouseUp={() => setNotifImg(NotificationsHollow)}
                        onMouseOver={() => setNotifImg(NotificationsSolid)}
                        onMouseOut={() => setNotifImg(NotificationsHollow)}
                    />
                    <SettingsPopup user={user} viewSettings={viewSettings} setViewSettings={setViewSettings} />
                </div>
                <img id="settings-button" 
                    src={settingsImg} 
                    onClick={clickSettings}
                    onMouseDown={() => setSettingsImg(SettingsSolid)}
                    onMouseUp={() => setSettingsImg(SettingsHollow)}
                    onMouseOver={() => setSettingsImg(SettingsSolid)}
                    onMouseOut={() => setSettingsImg(SettingsHollow)}
                />
            </div>
        </div>
    )
}

export { Navbar }