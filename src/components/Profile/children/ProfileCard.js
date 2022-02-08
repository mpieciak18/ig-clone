import { getUrl } from '../../../firebase/storage.js'
import { Follows } from '../../other/Follows.js'
import { useState, useEffect } from 'react'

const ProfileCard = async (props) => {
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
    }, [followsOn])

    return (
        <div id='profile-card'>
            <img id='profile-card-icon' src={async () => await getUrl(user.data.image)} />
            <div id='profile-card-name'>{user.data.name}</div>
            <div id='profile-card-username'>{user.data.username}</div>
            <div id='profile-card-stats'>
                <div id='profile-card-posts'>
                    <p className='profile-stats-child'>{user.data.posts}</p>
                    <p className='profile-stats-child'>Posts</p>
                </div>
                <div id='profile-card-following' onClick={clickFollowing}>
                    <p className='profile-stats-child'>{user.data.following}</p>
                    <p className='profile-stats-child'>Following</p>
                </div>
                <div id='profile-card-followers' onClick={clickFollowers}>
                    <p className='profile-stats-child'>{user.data.followers}</p>
                    <p className='profile-stats-child'>Followers</p>
                </div>
            </div>
            <div id='profile-card-bio'>{user.data.bio}</div>
            {follows}
        </div>
    )
}

export { ProfileCard }