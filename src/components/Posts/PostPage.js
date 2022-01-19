import '../../styles/components/Posts/Post.css'
import { Link } from 'react-router-dom'
import { CommentsBar } from './CommentsBar.js'
import { PostButtons } from './PostButtons.js'

const PostPage = async (props) => {
    const { postId, postText, postImage, postDate, postOwnerId, postLikes, postComments, user } = props

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
                    <PostButtons user={user} postId={postId} postOwnerId={postOwnerId} />
                    <div class="post-right-bottom-two">
                        <div class="post-likes"></div>
                        <div class="post-date"></div>
                    </div>
                    <CommentsBar user={user} postId={postId} postOwnerId={postOwnerId} />
                </div>
            </div>
        </div>
    )
}

export { PostPage }