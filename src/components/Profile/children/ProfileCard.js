import { getUrl } from '../../../firebase/storage.js'
import { useState, useEffect } from 'react'
import { findUser } from '../../../firebase/users.js'

const ProfileCard = (props) => {
    const { user, otherUserId, setWhichTab, setFollowsOn } = props

    // Init profile image state
    const [img, setImg] = useState(null)

    // Init otherUser id/data state
    const [otherUser, setOtherUser] = useState(null)

    // Init profileCard component state
    const [profileCard, setProfileCard] = useState(null)

    // Update img & otherUser states on render
    useEffect(async () => {
        const newUser = await findUser(otherUserId)
        const imgSrc = await getUrl(newUser.data.image)
        setImg(imgSrc)
        setOtherUser(newUser)
    }, [])
    
    useEffect(() => {
        if (otherUser != null) {
            setProfileCard(
                <div id='profile-card'>
                    <div id='profile-card-top'>
                        <img id='profile-card-icon' src={img} />
                        <div id='profile-card-text'>
                            <div id='profile-card-name'>{otherUser.data.name}</div>
                            <div id='profile-card-username'>@{otherUser.data.username}</div>
                        </div>
                    </div>
                    <div id='profile-card-bottom'>
                        <div id='profile-card-stats'>
                            <div id='profile-card-posts'>
                                <p className='profile-stats-child-num'>{otherUser.data.posts}</p>
                                <p className='profile-stats-child-type'>Posts</p>
                            </div>
                            <div id='profile-card-following' onClick={clickFollowing}>
                                <p className='profile-stats-child-num'>{otherUser.data.following}</p>
                                <p className='profile-stats-child-type'>Following</p>
                            </div>
                            <div id='profile-card-followers' onClick={clickFollowers}>
                                <p className='profile-stats-child-num'>{otherUser.data.followers}</p>
                                <p className='profile-stats-child-type'>Followers</p>
                            </div>
                        </div>
                        <div id='profile-card-bio'>{otherUser.data.bio}</div> 
                    </div>
                </div>
            )
        }
    }, [otherUser])

    // Open Follows pop-up (following)
    const clickFollowing = async () => {
        await setWhichTab('following')
        setFollowsOn(true)
    }

    // Open Follows pop-up (followers)
    const clickFollowers = async () => {
        await setWhichTab('followers')
        setFollowsOn(true)
    }

    return profileCard
}

export { ProfileCard }