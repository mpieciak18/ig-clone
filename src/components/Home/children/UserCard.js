import { Link } from "react-router-dom"
import { getUrl } from "../../../firebase/storage.js"
import { Follows } from "../../other/Follows.js"
import { useState, useEffect } from "react"

const UserCard = (props) => {
    const { user } = props

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
    }, followsOn)

    if (user.loggedIn == false) {
        return (
            <div id="user-card">
                <Link id="user-card-sign-up">Sign Up</Link>
                <Link id="user-card-login">Login</Link>
            </div>
        )
    } else {
        return (
            <div id="user-card">
                <Link id="user-card-top" to={`/${user.id}`}>
                    <img id='user-card-icon' src={async () => await getUrl(user.image)} />
                    <div id="user-card-names">
                        <div id='user-card-name'>{user.name}</div>
                        <div id='user-card-username'>{user.username}</div>
                    </div>
                </Link>
                <div id='user-card-stats'>
                    <div id='user-card-posts'>
                        <p className='user-stats-child'>{user.posts}</p>
                        <p className='user-stats-child'>Posts</p>
                    </div>
                    <div id='user-card-following'>
                        <p className='user-stats-child'>{user.following}</p>
                        <p className='user-stats-child' onClick={clickFollowing}>Following</p>
                    </div>
                    <div id='user-card-followers'>
                        <p className='user-stats-child'>{user.followers}</p>
                        <p className='user-stats-child' onClick={clickFollowers}>Followers</p>
                    </div>
                </div>
                {follows}
            </div>
        )
    }
}

export { UserCard }