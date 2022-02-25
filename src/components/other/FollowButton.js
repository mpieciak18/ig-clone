import { checkForFollow, addFollow, removeFollow } from '../../firebase/followers.js'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './other.css'

const FollowButton = (props) => {
    const { user, otherUserId } = props

    const navigate = useNavigate()

    const path = useLocation().path

    // Init states

    const [isFollowing, setIsFollowing] = useState(false)

    const [isUpdating, setIsUpdating] = useState(false)

    const [followText, setFollowText] = useState('Follow')

    const [followButtonClass, setFollowButtonClass] = useState('inactive')

    // Update isFollowing on user prop change & on render
    useEffect(async () => {
        if (user != null) {
            const result = await checkForFollow(otherUserId)
            setIsFollowing(result)
        } else {
            setIsFollowing(false)
        }
    }, [user])

    // Update isUpdating, followText, & followButtonClass when isFollowing changes
    useEffect(async () => {
        setIsUpdating(true)
        setFollowButtonClass('inactive')
        if (isFollowing == true) {
            setFollowText('Unfollow')
        } else {
            setFollowText('Follow')
        }
    }, [isFollowing])

    // Change followButtonClass back to loaded when followText changes
    useEffect(() => {
        setIsUpdating(false)
        setFollowButtonClass('active')
    }, [followText])

    // User clicks on follow button & either follows or unfollows other user
    const clickFollow = async () => {
        if (user == null) {
            navigate('/signup', {state: {path: path}})
        } else if (isUpdating == false && isFollowing == false) {
            await addFollow(otherUserId)
            setIsFollowing(true)
        } else if (isUpdating == false && isFollowing == true) {
            await removeFollow(otherUserId)
            setIsFollowing(false)
        }
    }

    return (
        <div className={`follow-button ${followButtonClass}`} onClick={clickFollow}>
            {followText}
        </div>
    )
}

export { FollowButton }