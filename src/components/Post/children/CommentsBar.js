import { newComment } from '../../../firebase/comments.js'
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

    const path = useLocation().pathname

    const redirect = () => {
        return <Navigate to='/signup' state={{path: path}} />
    }

    if (user.loggedIn == true) {
        return (
            <form className="post-comment-bar" onSubmit={() => addNewComment}>
                <input 
                    type="text"
                    name="comment"
                    className="post-comment-bar-input"
                    placeholder="Add a comment..."
                    value={commentValue}
                    ref={inputRef}
                />
                <button type="submit" className="post-comment-bar-button">
                    <img className="post-comment-bar-button-icon" />
                </button>
            </form>
        )
    } else {
        return (
            <form to='/login' className="post-comment-bar" onClick={redirect}>
                <input type="text" name="comment" className="post-comment-bar-input" placeholder="Add a comment..." />
                <button type="button" className="post-comment-bar-button">
                    <img className="post-comment-bar-button-icon" />
                </button>
            </form>
        )
    }
}

export { CommentsBar }