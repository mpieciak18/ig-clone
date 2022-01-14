import '.../styles/components/Profile/ProfileButtons.css'
import { checkForFollow, addFollow, removeFollow } from '../firebase/followers.js'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'

const ProfileButtons = async (props) => {
    const { userId } = props

    // Set up history & back function
    const history = useHistory()
    const goBack = () => {history.goBack()}

    // Init followText & followButtonClass states
    const isFollowing = await checkForFollow(userId)
    const [followText, setFollowText] = useState(() => {
        if (isFollowing == true) {
            return 'Follow'
        } else {
            return 'Unfollow'
        }
    })
    const [followButtonClass, setFollowButtonClass] = useState('loaded')

    // Update follow status & associated states
    const clickFollow = async () => {
        setFollowButtonClass('not-loaded')
        if (followText == 'Follow') {
            await addFollow(userId)
            setFollowText('Unfollow')
            setFollowButtonClass('loaded')
        } else {
            await removeFollow(userId)
            setFollowText('Follow')
            setFollowButtonClass('loaded')
        }
    }

    return (
        <div id='buttons-section'>
            <div id='post-back-button' onClick={goBack}>
                <div id='back-arrow'>⇽</div>
                <div id='back-text'>Go Back</div>
            </div>
            <div id='buttons-section-right'>
                <div id='follow-button' class={followButtonClass} onClick={clickFollow}>
                    {followText}
                </div>
                <div id='direct-message-button-container'>
                    <img id='direct-message-button' />
                </div>
            </div>
        </div>
    )
}

export { ProfileButtons }