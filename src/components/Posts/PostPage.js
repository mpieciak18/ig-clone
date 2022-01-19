import '.../styles/components/Post.css'
import { Link } from 'react-router-dom'

const PostPage = async (props) => {
    const { page, id, text, image, date, postOwnerId, likes, comments, user } = props

    return (
        <div class="single-post-page">
            <div class="post-left"></div>
            <div class="post-right">
                <div class="post-right-top">
                    <Link class="post-user-link" to={`/${postOwnerId}`}>
                        <img class="post-user-link-avatar" />
                        <div class="post-user-link-name-and-username-parent">
                            <div class='post-user-link-name'></div>
                            <div class='post-user-link-username'></div>
                        </div>
                    </Link>
                    <div class="post-text"></div>
                </div>
                <div class="post-right-middle"></div>
                <div class="post-right-bottom">
                    <div class="post-right-bottom-one">
                        <div class="post-buttons">
                            <img class="post-like-button"/>
                            <img class="post-comment-button"/>
                            <img class="post-share-button"/>
                        </div>
                        <div class="post-options-button">···</div>
                    </div>
                    <div class="post-right-bottom-two">
                        <div class="post-likes"></div>
                        <div class="post-date"></div>
                    </div>
                    <div class="post-comment-bar">
                        <div class="post-comment-bar-input"></div>
                        <div class="post-comment-bar-button"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { PostPage }