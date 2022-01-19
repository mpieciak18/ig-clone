import '.../styles/components/Post.css'
import { Link } from 'react-router-dom'
import { newComment } from '../../firebase/comments.js'

const PostReel = async (props) => {
    const { page, id, text, image, date, postOwnerId, likes, comments, user } = props

    const addNewComment = (event) => {
        event.preventDefault()
        const comment = event.target.comment
        let date
        await newComment(id, date, postOwnerId, comment)
    }

    return (
        <div class="single-post-component">
            <div class="post-top"></div>
                <div class="post-top-left">
                    <Link class="post-user-link" to={`/${postOwnerId}`}>
                        <img class="post-user-link-avatar" />
                        <div class="post-user-link-name-and-username-parent">
                            <div class='post-user-link-name'></div>
                            <div class='post-user-link-username'></div>
                        </div>
                    </Link>
                </div>
                <div class="post-options-button">···</div>
            <div class="post-middle"></div>
            <div class="post-bottom">
                <div class="post-buttons">
                    <div class="post-buttons-left">
                        <img class="post-like-button"/>
                        <img class="post-comment-button"/>
                        <Link to={`/${postOwnerId}/${id}`}>
                            <img class="post-share-button"/>
                        </Link>
                    </div>
                    <div class="post-save-button"></div>
                </div>
                <div class="post-likes"></div>
                <Link class="post-view-comments" to={`/${postOwnerId}/${id}`}>
                    View more comments...
                </Link>
                <div class="post-comments"></div>
                <form class="post-comment-bar" onSubmit={() => addNewComment}>
                    <input type="text" name="comment" class="post-comment-bar-input" placeholder="Add a comment..." />
                    <button type="submit" class="post-comment-bar-button">
                        <img class="post-comment-bar-button-icon" />
                    </button>
                </form>
            </div>
        </div>
    )
}

export { PostReel }