import '../styles/PostFull.css'
import { Link } from 'react-router-dom'
import { addSavedPost, removeSavedPost } from '../firebase/savedposts.js'

const PostFull = async (props) => {
    const { page, id, text, image, date, postOwnerId, likes, comments, user } = props

    let Post
    // Render post for reel of posts (ie, home page or user page)
    if (page == false) {
        Post = (
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
                    <div class="post-comment-bar">
                        <div class="post-comment-bar-input"></div>
                        <div class="post-comment-bar-button"></div>
                    </div>
                </div>
            </div>
        )
    // Render post for individual post page
    } else {
        Post = (
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

    return {Post}
}

export { PostFull }