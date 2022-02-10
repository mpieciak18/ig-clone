import { Link } from "react-router-dom"
import { getUrl } from "../../../firebase/storage.js"
import { Follows } from "../../other/Follows.js"
import { useState, useEffect } from "react"

const UserCard = (props) => {
    const { user } = props

    // Init state for user's profile image
    const [userImage, setUserImage] = useState(null)

    // Updates user image state when user prop changes
    useEffect(async() => {
        if (user == null) {
            setUserImage(null)
        } else {
            const path = `/${user.data.image}`
            const img = await getUrl(path)
            setUserImage(img)
        }
    }, user)

    // Init state to show/hide Follows pop-up
    const [followsOn, setFollowsOn] = useState(false)

    // Init state to determine if pop-up shows following or followers
    const [followingVsFollower, setFollowingVsFollower] = useState('following')

    // Open Follows pop-up (following)
    const clickFollowing = () => {
        setFollowingVsFollower('following')
        setFollowsOn(true)
    }

    // Open Follows pop-up (followers)
    const clickFollowers = () => {
        setFollowingVsFollower('followers')
        setFollowsOn(true)
    }

    // Renders Follows pop-up when followsOn == true
    let follows = null
    useEffect(() => {
        if (followsOn == false) {
            follows = null
        } else {
            follows = (
                <Follows
                    setFollowsOn={setFollowsOn}
                    userId={user.id}
                    followingVsFollower={followingVsFollower}
                    setFollowingVsFollower={setFollowingVsFollower}
                />
            )
        }
    }, [followsOn])

    if (user == null) {
        return (
            <div id="user-card">
                <Link id="user-card-sign-up" to='/signup'>Sign Up</Link>
                <Link id="user-card-login" to='/login'>Login</Link>
            </div>
        )
    } else {
        return (
            <div id="user-card">
                <Link id="user-card-top" to={`/${user.id}`}>
                    <img id='user-card-icon' src={userImage} />
                    <div id="user-card-names">
                        <div id='user-card-name'>{user.data.name}</div>
                        <div id='user-card-username'>{`@${user.data.username}`}</div>
                    </div>
                </Link>
                <div id='user-card-bottom'>
                    <div id='user-card-posts'>
                        <p className='user-stats-child-num'>{user.data.posts}</p>
                        <p className='user-stats-child-type'>Posts</p>
                    </div>
                    <div id='user-card-following'>
                        <p className='user-stats-child-num'>{user.data.following}</p>
                        <p className='user-stats-child-type' onClick={clickFollowing}>Following</p>
                    </div>
                    <div id='user-card-followers'>
                        <p className='user-stats-child-num'>{user.data.followers}</p>
                        <p className='user-stats-child-type' onClick={clickFollowers}>Followers</p>
                    </div>
                </div>
                {follows}
            </div>
        )
    }
}

export { UserCard }