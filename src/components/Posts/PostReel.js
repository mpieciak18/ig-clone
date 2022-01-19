import '../../styles/components/Posts/Post.css'
import { Link } from 'react-router-dom'
import { CommentsBar } from './CommentsBar.js'
import { PostButtons } from './PostButtons.js'

const PostReel = async (props) => {
    const { postId, postText, postImage, postDate, postOwnerId, postLikes, postComments, user } = props

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
            <div class="post-middle"></div>
            <div class="post-bottom">
                <PostButtons user={user} postId={postId} postOwnerId={postOwnerId} />
                <div class="post-likes"></div>
                <Link class="post-view-comments" to={`/${postOwnerId}/${id}`}>
                    View more comments...
                </Link>
                <div class="post-comments"></div>
                <CommentsBar user={user} postId={postId} postOwnerId={postOwnerId} />
            </div>
        </div>
    )
}

export { PostReel }