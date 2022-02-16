import { newComment } from '../../../../firebase/comments.js'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import SendHollow from '../../../../assets/images/dm.png'

const CommentsBar = (props) => {
    const { user, postId, postOwnerId, commentsNum, setCommentsNum, inputRef } = props
    // Init form component state
    const [form, setForm] = useState(null)

    // Init values for redirect on click if user is not logged in
    const path = useLocation().pathname

    const navigate = useNavigate()

    const redirect = () => {
        navigate('/signup', {state: {path: path}})
    }

    // Set initial comment input value & reset it on submission
    const [commentValue, setCommentValue] = useState('')

    // Updates comment state / field
    const updateComment = (e) => {
        const val = e.target.value
        setCommentValue(val)
    }

    // Adds comment to comments subcollection of post in firebase
    const addNewComment = async (e) => {
        e.preventDefault()
        if (commentValue.length > 0) {
            await newComment(postOwnerId, postId, commentValue)
            setCommentValue('')
            await setCommentsNum(commentsNum + 1)
        }
    }

    // Update form component when user prop/state changes
    useEffect(() => {
        if (user != null) {
            setForm(
                <form className="post-comment-bar" onSubmit={addNewComment}>
                    <input 
                        type="text"
                        className="post-comment-bar-input"
                        placeholder="Add a comment..."
                        onChange={updateComment}
                        value={commentValue}
                        ref={inputRef}
                    />
                    <button type="submit" className="post-comment-bar-button inactive">
                        Post
                    </button>
                </form>
            )
        } else {
            setForm(
                <form className="post-comment-bar" onClick={redirect}>
                    <input type="text" className="post-comment-bar-input" placeholder="Add a comment..." />
                    <button type="button" className="post-comment-bar-button inactive">
                        Post
                    </button>
                </form>
            )
        }
    }, [user])

    useEffect(() => {
        if (commentValue.length > 0) {
            setForm(
                <form className="post-comment-bar" onSubmit={addNewComment}>
                    <input 
                        type="text"
                        className="post-comment-bar-input"
                        placeholder="Add a comment..."
                        onChange={updateComment}
                        value={commentValue}
                        ref={inputRef}
                    />
                    <button type="submit" className="post-comment-bar-button active">
                        Post
                    </button>
                </form>
            )
        } else {
            setForm(
                <form className="post-comment-bar">
                    <input 
                        type="text"
                        className="post-comment-bar-input"
                        placeholder="Add a comment..."
                        onChange={updateComment}
                        value={commentValue}
                        ref={inputRef}
                    />
                    <button type="button" className="post-comment-bar-button inactive">
                        Post
                    </button>
                </form>
            )
        }
    }, [commentValue])

    return(form)
}

export { CommentsBar }