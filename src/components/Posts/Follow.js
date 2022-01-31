import { checkForFollow, addFollow, removeFollow } from '../firebase/followers.js'
import { useState } from 'react'

const FollowButton = async (props) => {
    const { otherUserId } = props

    // Init followText & followButtonClass states
    const isFollowing = await checkForFollow(otherUserId)
    const [followText, setFollowText] = useState(() => {
        if (isFollowing == true) {
            return 'Follow'
        } else {
            return 'Unfollow'
        }
    })
    const [followButtonClass, setFollowButtonClass] = useState('like-follow-button-loaded')

    // Update follow status & associated states
    const clickFollow = async () => {
        setFollowButtonClass('like-follow-button-not-loaded')
        if (followText == 'Follow') {
            await addFollow(userId)
            setFollowText('Unfollow')
            setFollowButtonClass('like-follow-button-loaded')
        } else {
            await removeFollow(userId)
            setFollowText('Follow')
            setFollowButtonClass('like-follow-button-loaded')
        }
    }

    return (
        <div class={followButtonClass} onClick={clickFollow}>
            {followText}
        </div>
    )
}

export { FollowButton }