import { useState, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import { getLikes } from '../../firebase/likes.js'
import { checkForFollow, addFollow, removeFollow } from '../../firebase/followers.js'
import { getUrl } from '../../firebase/storage.js'

const Likes = (props) => {
    const { setLikesOn, postId, postOwnerId } = props

    // Closes likes pop-up
    const hideLikes = (e) => {
        const id = e.target.id
        if (id == "likes" || id == "likes-x-button") {
            setLikesOn(false)
        }
    }

    // Renders follow (or unfollow) button
    const followButton = (user) => {
        //
    }

    // Redirect to user's profile
    const redirect = (id) => {
        //
    }

    // Renders like of users who liked the post
    const likesList = async () => {
        const users = await getLikes(postId, postOwnerId)
        return (
            <div id='likes-list'>
                {users.map((user) => {
                    <div className='like-row' onClick={() => redirect(user.id)}>
                        <div className='like-row-left'>
                            <img className='like-image' src={getUrl(user.data.image)} />
                            <div className='like-text'>
                                <div className='like-name'>{user.data.name}</div>
                                <div className='like-username'>@{user.data.username}</div>
                            </div>
                        </div>
                        <div className='like-row-right'>
                            {followButton(user.id)}
                        </div>
                    </div>
                })}
            </div>
        )
    }

    return (
        <div id="likes" onClick={hideLikes}>
            <div id="likes-pop-up">
                <div id="likes-header">
                    <div id="likes-title">Likes</div>
                    <div id="likes-x-button">✕</div>
                </div>
                <div id="likes-divider" />
                {likesList()}
            </div>
        </div>
    )
}

export { Likes }