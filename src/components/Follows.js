import { Navigate } from 'react-router-dom'
import { getFollowing, getFollowers } from '../firebase/followers.js'
import { FollowButton } from '../FollowButton.js'
import '../../styles/components/FollowerFollowing.css'
import { useEffect, useState } from 'react'

const Follows = async (props) => {
    const { setFollowsOn, userId, followingVsFollower, setFollowingVsFollower } = props

    // Closes follows pop-up
    const hideFollows = (e) => {
        const id = e.target.id
        if (id == "follows" || id == "follows-x-button") {
            setFollowsOn(false)
        }
    }

    // Init following/follower users arr state
    const [users, setUsers] = useState(() => {
        if (followingVsFollower == 'following') {
            return getFollowing(userId)
        } else {
            return getFollowers(userId)
        }
    })

    // Init following/follower users count
    const [usersNumber, setUsersNumber] = useState(20)

    // Init all loaded state
    const [allLoaded, setAllLoaded] = useState(false)

    // Init followers & following button classes
    const [followingButtonClass, setFollowingButtonClass] = useState(() => {
        if (followingVsFollower = 'following') {
            return 'active'
        } else {
            return 'inactive'
        }
    })
    const [followersButtonClass, setFollowerButtonClass] = useState(() => {
        if (followingVsFollower = 'follower') {
            return 'active'
        } else {
            return 'inactive'
        }
    })

    // Change users & buttons states when followingVsFollower state changes
    useEffect(() => {
        setUsersNumber(20)
        if (followingVsFollower == 'follower') {
            setFollowerButtonClass('follower-button active')
            setFollowingButtonClass('following-button')
            setUsers(getFollowers(userId, 20))
        } else {
            setFollowerButtonClass('follower-button')
            setFollowingButtonClass('following-button active')
            setUsers(getFollowing(userId, 20))
        }
    }, followingVsFollower)

    // Load more follows/followers when user reaches bottom of pop-up
    const loadMore = (e) => {
        const elem = e.target
        if ((Math.ceil(elem.scrollHeight - elem.scrollTop) == elem.clientHeight) &&
        (allLoaded == false)) {
            const newUsersNumber = usersNumber + 20
            setUsersNumber(newUsersNumber)
            let newUsers 
            if (followingVsFollower == 'follower') {
                newUsers = await getFollowers(userId, newUsersNumber)
                setUsers(newUsers)
            } else {
                newUsers = await getFollowing(userId, newUsersNumber)
                setUsers(newUsers)
            }
            if (newUsers.length < newUsersNumber) {
                setAllLoaded(true)
            }
        }
    }

    // Renders list of followers/following
    const followsList = async () => {
        return (
            <div id='follows-list' onScroll={loadMore}>
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
    const followersClick = () => {
        setFollowingVsFollower('followers')
        setAllLoaded(false)
    }
    const followingClick = () => {
        setFollowingVsFollower('following')
        setAllLoaded(false)
    }

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