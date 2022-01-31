import '.../styles/components/Profile/ProfileButtons.css'
import { checkForFollow, addFollow, removeFollow } from '../firebase/followers.js'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'
import { FollowButton } from '../FollowButton.js'

const ProfileButtons = async (props) => {
    const { userId } = props

    // Set up history & back function
    const history = useHistory()
    const goBack = () => {history.goBack()}

    return (
        <div id='buttons-section'>
            <div id='post-back-button' onClick={goBack}>
                <div id='back-arrow'>⇽</div>
                <div id='back-text'>Go Back</div>
            </div>
            <div id='buttons-section-right'>
                <FollowButton userId={userId} />
                <div id='direct-message-button-container'>
                    <img id='direct-message-button' />
                </div>
            </div>
        </div>
    )
}

export { ProfileButtons }