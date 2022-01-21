import { newComment } from '../../firebase/comments.js'
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const CommentsBar = (props) => {
    const { user, postId, postOwnerId, updateComments, inputRef } = props

    // Adds comment to comments subcollection of post in firebase
    const addNewComment = async (e) => {
        e.preventDefault()
        const commentText = e.target.comment.value
        await newComment(postId, postOwnerId, commentText)
        setCommentValue('')
        await updateComments()
    }

    // Set initial comment input value & reset it on submission
    const [commentValue, setCommentValue] = useState('')

    const redirect = () => {
        const path = useLocation().pathname
        return <Navigate to='/signup' state={{path: path}} />
    }

    if (user.loggedIn == true) {
        return (
            <form class="post-comment-bar" onSubmit={() => addNewComment}>
                <input 
                    type="text"
                    name="comment"
                    class="post-comment-bar-input"
                    placeholder="Add a comment..."
                    value={commentValue}
                    ref={inputRef}
                />
                <button type="submit" class="post-comment-bar-button">
                    <img class="post-comment-bar-button-icon" />
                </button>
            </form>
        )
    } else {
        return (
            <form to='/login' class="post-comment-bar" onClick={redirect}>
                <input type="text" name="comment" class="post-comment-bar-input" placeholder="Add a comment..." />
                <button type="button" class="post-comment-bar-button">
                    <img class="post-comment-bar-button-icon" />
                </button>
            </form>
        )
    }
}

export { CommentsBar }