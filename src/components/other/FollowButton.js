import { checkForFollow, addFollow, removeFollow } from '../../firebase/followers.js'
import { useState } from 'react'
import './other.css'
import { useEffect } from 'react/cjs/react.development'

const FollowButton = (props) => {
    const { otherUserId } = props

    // Init states

    const [isFollowing, setIsFollowing] = useState(false)

    const [isUpdating, setIsUpdating] = useState(false)

    const [followText, setFollowText] = useState('Follow')

    const [followButtonClass, setFollowButtonClass] = useState('follow-button-not-loaded')

    // Update isFollowing on render
    useEffect(async () => {
        const result = await checkForFollow(otherUserId)
        setIsFollowing(result)
    }, [])

    // Update isUpdating, followText, & followButtonClass when isFollowing changes
    useEffect(async () => {
        setIsUpdating(true)
        setFollowButtonClass('follow-button-not-loaded')
        if (isFollowing == true) {
            setFollowText('Unfollow')
        } else {
            setFollowText('Follow')
        }
    }, [isFollowing])

    // Change followButtonClass back to loaded when followText changes
    useEffect(() => {
        setIsUpdating(false)
        setFollowButtonClass('follow-button-loaded')
    }, [followText])

    // User clicks on follow button & either follows or unfollows other user
    const clickFollow = async () => {
        if (isUpdating == false && isFollowing == false) {
            await addFollow(otherUserId)
            setIsFollowing(true)
        } else if (isUpdating == false && isFollowing == true) {
            await removeFollow(otherUserId)
            setIsFollowing(false)
        }
    }

    return (
        <div className={followButtonClass} onClick={clickFollow}>
            {followText}
        </div>
    )
}

export { FollowButton }