import { likeExists, addLike, removeLike } from '../../../../firebase/likes.js'
import LikeHollow from '../../../../assets/images/like.png'
import LikeSolid from '../../../../assets/images/like-solid.png'
import { useEffect, useState } from 'react'

const LikeButton = (props) => {
    const { user, postId, postOwnerId, redirect } = props

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const [likeId, setLikeId] =  useState(null)

    const [isUpdating, setIsUpdating] = useState(false)

    const [imgSrc, setImgSrc] = useState(LikeHollow)

    useEffect(async () => {
        const likeExists = await likeExists(postId, postOwnerId)
        setLikeId(likeExists)
        setImgSrc (() => {
            if (likeExists != null) {
                return LikeSolid
            } else {
                return LikeHollow
            }
        })
        setIsLoggedIn(user != null)
    }, [])

    // Called on by likeButtonFunction and runs lbfIsRunning is false
    const addRemoveLike = async () => {
        // disable like button function while functions run
        setIsUpdating(true)
        // perform db updates & state changes
        if (likeId == null) {
            setLikeId(await addLike(postId, postOwnerId))
        } else {
            await removeLike(likeId, postId, postOwnerId)
            setLikeId(null)
        }
        // enable like button once everything is done
        setIsUpdating(false)
    }

    // Runs when like button is clicked and calls addRemoveLike() when lbfIsrunning is false
    const likeButtonFunction = () => {
        if (isLoggedIn == false) {
            redirect()
        } else if (isUpdating == false && isLoggedIn == true) {
            addRemoveLike()
        }
    }

    return <img className="post-like-button" src={imgSrc} onClick={likeButtonFunction} />
}

export { LikeButton }