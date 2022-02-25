import { useNavigate } from 'react-router-dom'
import { getFollowing, getFollowers } from '../../firebase/followers.js'
import { FollowButton } from './FollowButton.js'
import './other.css'
import { useEffect, useState } from 'react'
import { getUrl } from '../../firebase/storage.js'
import { findUser } from '../../firebase/users.js'

const Follows = async (props) => {
    const { user, otherUserId, setFollowsOn, initTab } = props

    const navigate = useNavigate()

    // Init following/follower users count
    const [usersCount, setUsersCount] = useState(20)

    // Init following/follower users arr state
    const [usersArr, setUsersArr] = useState(null)

    // Init following/follower component state
    const [users, setUsers] = useState(null)

    // Init all loaded state
    const [allLoaded, setAllLoaded] = useState(false)

    // Init whichTab state
    const [whichTab, setWhichTab] = useState(null)

    // Init followers & following buttons classes
    const [buttonOne, setButtonOne] = useState(null)
    const [buttonTwo, setButtonTwo] = useState(null)

    // Change whichTab upon render & initTab prop change
    useEffect(() => {
        setWhichTab(initTab)
    }, [initTab])

    // Change usersCount, allLoaded, and button states when whichTab changes
    useEffect(() => {
        setUsersCount(20)
        setAllLoaded(false)
        if (whichTab == 'following') {
            setButtonOne('active')
            setButtonTwo('inactive')
        } else {
            setButtonOne('inactive')
            setButtonTwo('active')
        }
    }, [whichTab])

    // Change usersArr state when usersCount changes
    useEffect(async () => {
        if (whichTab == 'following') {
            const returnVal = await getFollowing(otherUserId, usersCount)
            setUsers(returnVal)
        } else {
            const returnVal = await getFollowers(otherUserId, usersCount)
            setUsers(returnVal)
        }
    }, [usersCount])

    // Update users component state when usersArr changes
    useEffect(async () => {
        const newUsers = (
            <div id='follows-list' onScroll={loadMore}>
                {usersArr.map(async (user) => {
                    let userId
                    if (whichTab == 'following') {
                        userId = user.otherUser
                    } else {
                        userId = user.self
                    }
                    const userInfo = await findUser(userId)
                    const redirect = () => navigate(`/${userId}`)
                    const image = await getUrl(userInfo.data.image)
                    return (
                        <div className='follow-row' onClick={redirect}>
                            <div className='follow-row-left'>
                                <img className='follow-image' src={image} />
                                <div className='follow-text'>
                                    <div className='follow-name'>{userInfo.data.name}</div>
                                    <div className='follow-username'>@{userInfo.data.username}</div>
                                </div>
                            </div>
                            <div className='follow-row-right'>
                                <FollowButton otherUserId={userId} />
                            </div>
                        </div>
                    )
                })}
            </div>
        )
        const returnVal = await Promise.all(newUsers)
        setUsers(returnVal)
    }, [usersArr])

    // Load more follows/followers when user reaches bottom of pop-up
    const loadMore = async (e) => {
        if (allLoaded == false) {
            const elem = e.target
            if ((Math.ceil(elem.scrollHeight - elem.scrollTop) == elem.clientHeight)) {
                const newCount = usersCount + 20
                setUsersCount(newCount)
                let newUsers
                if (whichTab == 'following') {
                    newUsers = await getFollowing(otherUserId, newCount)
                    setUsers(newUsers)
                } else {
                    newUsers = await getFollowers(otherUserId, newCount)
                    setUsers(newUsers)
                }
                if (newUsers.length < newCount) {
                    setAllLoaded(true)
                }
            }
        }
    }

    // Event handlers for buttons
    const followingClick = () => {
        setWhichTab('following')
    }

    const followersClick = () => {
        setWhichTab('followers')
    }

    const xButtonClick = () => {
        setFollowsOn(false)
    }

    return (
        <div id="follow">
            <div id="follows-pop-up">
                <div id="follows-header">
                    <div id="follows-header-left">
                        <div id='following-button' className={buttonOne} onClick={followingClick}>Following</div>
                        <div id='followers-button' className={buttonTwo} onClick={followersClick}>Followers</div>
                    </div>
                    <div id="follows-x-button" onClick={xButtonClick}>✕</div>
                </div>
                <div id="follows-divider" />
                {users}
            </div>
        </div>
    )
}

export { Follows }