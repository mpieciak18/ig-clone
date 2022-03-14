import { useNavigate } from 'react-router-dom'
import { getFollowing, getFollowers } from '../../firebase/followers.js'
import { FollowButton } from './FollowButton.js'
import './other.css'
import { useEffect, useState } from 'react'
import { getUrl } from '../../firebase/storage.js'
import { findUser } from '../../firebase/users.js'

const Follows = (props) => {
    const { user, otherUserId, updatePopUp, initTab } = props

    const navigate = useNavigate()

    // Init following/follower users count
    const [usersCount, setUsersCount] = useState(null)

    // Init following/follower users arr state
    const [usersArr, setUsersArr] = useState(null)

    // Init following/follower component state
    const [users, setUsers] = useState(null)

    // Init all loaded state
    const [allLoaded, setAllLoaded] = useState(false)

    // Init loading state
    const [loadingMore, setLoadingMore] = useState(false)

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
    useEffect(async () => {
        await setUsersCount(0)
        await setAllLoaded(false)
        if (whichTab == 'following') {
            setButtonOne('active')
            setButtonTwo('inactive')
        } else {
            setButtonOne('inactive')
            setButtonTwo('active')
        }
        await setUsersCount(20)
    }, [whichTab])

    // Change usersArr state when usersCount changes
    useEffect(async () => {
        if (usersCount > 0 && whichTab == 'following') {
            const following = await getFollowing(otherUserId, usersCount)
            setUsersArr(following)
        } else if (usersCount > 0 && whichTab == 'followers') {
            const followers = await getFollowers(otherUserId, usersCount)
            setUsersArr(followers)
        }
    }, [usersCount])

    // Update users component state when usersArr changes
    useEffect(async () => {
        if (usersArr != null) {
            const newUsers = (
                usersArr.map(async (user) => {
                    let userId
                    if (whichTab == 'following') {
                        userId = user.data.otherUser
                    } else {
                        userId = user.data.self
                    }
                    const userInfo = await findUser(userId)
                    const redirect = () => navigate(`/${userId}`)
                    const image = await getUrl(userInfo.data.image)
                    return (
                        <div className='follow-row' key={user.id}>
                            <div className='follow-row-left' onClick={redirect}>
                                <img className='follow-image' src={image} />
                                <div className='follow-text'>
                                    <div className='follow-name'>{userInfo.data.name}</div>
                                    <div className='follow-username'>@{userInfo.data.username}</div>
                                </div>
                            </div>
                            <div className='follow-row-right'>
                                <FollowButton user={user} otherUserId={userId} />
                            </div>
                        </div>
                    )
                })
            )
            const returnVal = await Promise.all(newUsers)
            setUsers(returnVal)
        }
    }, [usersArr])

    // Load more follows/followers when user reaches bottom of pop-up
    const loadMore = async (e) => {
        if (allLoaded == false && loadingMore == false) {
            const elem = e.target
            if ((Math.ceil(elem.scrollHeight - elem.scrollTop) == elem.clientHeight)) {
                await setLoadingMore(true)
                const newCount = usersCount + 20
                await setUsersCount(newCount)
                let newUsersArr
                if (whichTab == 'following') {
                    newUsersArr = await getFollowing(otherUserId, newCount)
                    await setUsersArr(newUsersArr)
                } else {
                    newUsersArr = await getFollowers(otherUserId, newCount)
                    await setUsersArr(newUsersArr)
                }
                if (newUsersArr.length < newCount) {
                    await setAllLoaded(true)
                }
                await setLoadingMore(false)
            }
        }
    }

    // Event handlers for buttons
    const followingClick = () => setWhichTab('following')

    const followersClick = () => setWhichTab('followers')

    const xButtonClick = () => updatePopUp()

    return (
        <div id="follow">
            <div id="follows-pop-up">
                <div id="follows-header">
                    <div id="follows-x-button" onClick={xButtonClick}>« Go Back</div>
                    <div id="follows-header-menu">
                        <div id='following-button' className={buttonOne} onClick={followingClick}>Following</div>
                        <div id='followers-button' className={buttonTwo} onClick={followersClick}>Followers</div>
                    </div>
                    <div id="follows-x-button-hidden">« Go Back</div>
                </div>
                <div id="follows-divider" />
                <div id='follows-list' onScroll={loadMore}>
                    {users}
                </div>
            </div>
        </div>
    )
}

export { Follows }