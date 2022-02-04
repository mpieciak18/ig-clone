import { likeExists, addLike, removeLike } from '../../../../firebase/likes.js'
import { useState } from 'react'

const LikeButton = async (props) => {
    const { user, postId, postOwnerId, redirect } = props

    // Init likes & add functionality to the like button
    const [likeId, setLikeId] =  useState(await likeExists(postId, postOwnerId))
    const [likeButtonClass, setLikeButtonClass] = useState(() => {
        if (likeId != null) {
            return 'post-like-button liked'
        } else {
            return 'post-like-button not-liked'
        }
    })

    // Variable which prevents the likeButtonFunction from running more than once simultaneously
    let lbfIsRunning = false

    // Called on by likeButtonFunction and runs lbfIsRunning is false
    const addRemoveLike = async () => {
        // disable like button function while functions run
        lbfIsRunning = true
        // perform db updates & state changes
        if (likeId == null) {
            setLikeId(await addLike(postId, postOwnerId))
            setLikeButtonClass('post-like-button liked')
        } else {
            await removeLike(likeId, postId, postOwnerId)
            setLikeId(null)
            setLikeButtonClass('post-like-button not-liked')
        }
        // enable like button once everything is done
        lbfIsRunning = false
    }

    // Runs when like button is clicked and calls addRemoveLike() when lbfIsrunning is false
    const likeButtonFunction = () => {
        if (lbfIsRunning == false) {
            addRemoveLike()
        }
    }

    if (user.loggedIn == true) {
        return <img class={likeButtonClass} onClick={likeButtonFunction} /> 
    } else {
        return <img class="post-like-button not-liked" onClick={redirect} />
    }
}

export { LikeButton }