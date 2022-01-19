import { newComment } from '../../firebase/comments.js'
import { Navigate, useLocation } from 'react-router-dom'

const CommentsBar = (props) => {
    const { user, postId, postOwnerId } = props

    const addNewComment = (event) => {
        event.preventDefault()
        const commentText = event.target.comment
        await newComment(postId, postOwnerId, commentText)
    }

    const redirect = () => {
        const path = useLocation().pathname
        return <Navigate to='/' state={{path: path}} />
    }

    if (user.loggedIn == true) {
        return (
            <form class="post-comment-bar" onSubmit={() => addNewComment}>
                <input type="text" name="comment" class="post-comment-bar-input" placeholder="Add a comment..." />
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