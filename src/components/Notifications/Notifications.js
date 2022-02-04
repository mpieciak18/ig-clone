import { Navbar } from "../other/Navbar.js"
import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { getNotifications } from "../../firebase/notifications.js"
import { findUser } from "../../firebase/users.js"
import { findSinglePost } from "../../firebase/posts.js"
import { timeSince } from "../../other/timeSince.js"

const Notifications = async (props) => {
    // Redirect to signup page if not signed in
    const { user } = props
    if (user.loggedIn == false) {
        const path = useLocation().pathname
        return <Navigate to='/signup' state={{path: path}} />
    }

    // Set up navigate & back button
    const navigate = useNavigate()
    const goBack = () => navigate(-1)

    const BackButton = (
        <div id='post-back-button' onClick={goBack}>
            <div id='back-arrow'>⇽</div>
            <div id='back-text'>Go Back</div>
        </div>
    )

    // Init notifications number state
    const [notifNumber, setNotifNumber] = useState(10)

    // Init notifications array state
    const [notifs, setNotifs] = useState(await getNotifications(10))

     // Init all loaded state
    const [allLoaded, setAllLoaded] = useState(false)

    const notifications = () => {
        return (
            <div id='notifications-content'>
                {notifs.map(async (notif) => {
                    const otherUser = await findUser(notif.data.otherUser)
                    let notifClass
                    if (read == true) {
                        notifClass = "single-notification read"
                    } else {
                        notifClass = "single-notification unread"
                    }
                    let notifText
                    let notifLink
                    const notifTime = timeSince(notif.data.date)
                    if (type == "like") {
                        notifText = `${otherUser.data.username} liked your post.`
                        notifLink = `/${user.id}/${(await findSinglePost(notif.data.post)).id}`
                    } else if (type == "comment") {
                        notifText = `${otherUser.data.username} commented on your post.`
                        notifLink = `/${user.id}/${(await findSinglePost(notif.data.post)).id}`
                    } else if (type == "message") {
                        notifText = `${otherUser.data.username} messaged you.`
                        notifLink = `/messages`
                    } else if (type == "follow") {
                        notifText = `${otherUser.data.username} followed you.`
                        notifLink = `/${otherUser.data.id}`
                    }
                    const clickImage = () => {return <Navigate to={`/${otherUser.data.id}`} />}
                    const clickText = () => {return <Navigate to={notifLink} />}
                    return (
                        <div className={notifClass}>
                            <img className="single-notification-image" src={otherUser.data.image} onClick={clickImage} />
                            <div className="single-notification-link" onClick={clickText}>{notifText}</div>
                            <div className="single-notification-time">{notifTime}</div>
                        </div>
                    )
                })}
            </div>
        )
    }

    // Load-more function that updates the posts reel
    const loadMore = async () => {
        if (allLoaded == false) {
            const newNotifNumber = notifNumber + 10
            setNotifNumber(newNotifNumber)
        }
    }

    // Load more content when user reaches bottom of document
    window.addEventListener(() => {
        if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight - 2) {
            loadMore()
      }
    })

    // Update notifications state when notifNumber state changes
    useEffect(async () => {
        const newNotifsArr = await getNotifications(notifNumber)
        setNotifs(newPostsArr)
        if (newNotifsArr.length < notifNumber) {
            setAllLoaded(true)
        }
    }, notifNumber)

    return (
        <div id="notifications" className="page">
            <Navbar user={user} />
            <div id="notifications-header">
                {BackButton}
                <div id="notification-header-text">Notifications</div>
            </div>
            <div id="notifications-parent">
                {notifications}
            </div>
        </div>
    )
}

export { Notifications }