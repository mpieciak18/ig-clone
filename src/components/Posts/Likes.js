import { Navigate } from 'react-router-dom'
import { useState } from 'react'
import { getLikes } from '../../firebase/likes.js'
import { getUrl } from '../../firebase/storage.js'
import { FollowButton } from '../FollowButton.js'
import '../../styles/components/Posts/Likes.css'
import { useEffect } from 'react/cjs/react.development'

const Likes = async (props) => {
    const { setLikesOn, postId, postOwnerId } = props

    // Init likesNumber state
    const [likesNumber, setLikesNumber] = useState(20)

    // Init users state
    const [users, setUsers] = useState(await getLikes(postId, postOwnerId, 20))

    // Update users when likesNumber changes
    useEffect(() => {
        setUsers(await getLikes(postId, postOwnerId, likesNumber))
    }, likesNumber)

    // Load more likes when user reaches bottom of pop-up
    const loadMore = (e) => {
        const elem = e.target
        if (Math.ceil(elem.scrollHeight - elem.scrollTop) == elem.clientHeight) {
            const newLikesNumber = likesNumber + 20
            setLikesNumber(newLikesNumber)
        }
    }

    // Closes likes pop-up
    const hideLikes = (e) => {
        const id = e.target.id
        if (id == "likes" || id == "likes-x-button") {
            setLikesOn(false)
        }
    }

    // Renders like of users who liked the post
    const likesList = async () => {
        return (
            <div id='likes-list' onScroll={loadMore}>
                {users.map(async (user) => {
                    const redirect = () => <Navigate to={`/${user.id}`} />
                    const image = await getUrl(user.data.image)
                    return (
                        <div className='like-row' onClick={redirect}>
                            <div className='like-row-left'>
                                <img className='like-image' src={image} />
                                <div className='like-text'>
                                    <div className='like-name'>{user.data.name}</div>
                                    <div className='like-username'>@{user.data.username}</div>
                                </div>
                            </div>
                            <div className='like-row-right'>
                                <FollowButton otherUserId={user.id} />
                            </div>
                        </div>
                    )
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