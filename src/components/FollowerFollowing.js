import { Navigate } from 'react-router-dom'
import { getFollowing, getFollowers } from '../firebase/followers.js'
import { FollowButton } from '../FollowButton.js'
import '../../styles/components/FollowerFollowing.css'
import { useEffect, useState } from 'react'

const Follows = async (props) => {
    const { setFollowsOn, userId } = props

    // Init state = 'follower' or 'following'
    const initState = props.followVsFollower || 'following'

    // Init followingVsFollower state
    const [followingVsFollower, setFollowingVsFollower] = useState(initState)

    // Closes follows pop-up
    const hideFollows = (e) => {
        const id = e.target.id
        if (id == "follows" || id == "follows-x-button") {
            setFollowsOn(false)
        }
    }

    // Init following/follower users arr state
    const [users, setUsers] = useState(() => {
        if (initState == 'following') {
            return getFollowing(userId)
        } else {
            return getFollowers(userId)
        }
    })

    // Init followers & following button classes
    const [followingButtonClass, setFollowingButtonClass] = useState(() => {
        if (initState = 'following') {
            return 'active'
        } else {
            return 'inactive'
        }
    })
    const [followersButtonClass, setFollowerButtonClass] = useState(() => {
        if (initState = 'follower') {
            return 'active'
        } else {
            return 'inactive'
        }
    })

    // Change users & buttons states when followingVsFollower state changes
    useEffect(() => {
        if (followingVsFollower == 'follower') {
            setFollowerButtonClass('follower-button active')
            setFollowingButtonClass('following-button')
            setUsers(getFollowers(userId))
        } else {
            setFollowerButtonClass('follower-button')
            setFollowingButtonClass('following-button active')
            setUsers(getFollowing(userId))
        }
    }, followingVsFollower)

    // Renders list of followers/following
    const followsList = async () => {
        return (
            <div id='follows-list'>
                {users.map(async (user) => {
                    const redirect = () => <Navigate to={`/${user.id}`} />
                    const image = await getUrl(user.data.image)
                    return (
                        <div className='follow-row' onClick={redirect}>
                            <div className='follow-row-left'>
                                <img className='follow-image' src={image} />
                                <div className='follow-text'>
                                    <div className='follow-name'>{user.data.name}</div>
                                    <div className='follow-username'>@{user.data.username}</div>
                                </div>
                            </div>
                            <div className='follow-row-right'>
                                <FollowButton otherUserId={user.id} />
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    // Event handlers for header buttons
    const followersClick = () => setFollowingVsFollower('followers')
    const followingClick = () => setFollowingVsFollower('following')

    return (
        <div id="follow" onClick={hideFollows}>
            <div id="follows-pop-up">
                <div id="follows-header">
                    <div id="follows-header-left">
                        <div id='following-button' className={followingButtonClass} onClick={followersClick}>Following</div>
                        <div id='followers-button' className={followersButtonClass} onClick={followingClick}>Followers</div>
                    </div>
                    <div id="follows-x-button">✕</div>
                </div>
                <div id="follows-divider" />
                {followsList()}
            </div>
        </div>
    )
}

export { Follows }