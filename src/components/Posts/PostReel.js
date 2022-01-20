import '../../styles/components/Posts/Post.css'
import { Link } from 'react-router-dom'
import { CommentsBar } from './CommentsBar.js'
import { PostButtons } from './PostButtons.js'
import { getComments } from '../../firebase/comments.js'
import { findUser } from '../../firebase/user.js'

const PostReel = async (props) => {
    const { postId, postText, postImage, postDate, postOwnerId, postLikes, postComments, user } = props

    // Set up comments preview for underneath image
    const [comments, setComments] = useState(() => {
        const array = await getComments(postId, postOwnerId, 2)
        return array.reverse()
    })
    const commentsPreview = (
        <div class="post-comments">
            {comments.map(async (comment) => {
                const commenterId = comment.data.user
                const commenter = await findUser(commenterId)
                const commenterName = commenter.name
                return (
                    <div className='post-comment'>
                        <Link to={`/profile/${commenterId}`} className='post-comment-name'>{commenterName}</Link>
                        <div className='post=comment-text'>{comment.data.text}</div>
                    </div>
                )
            })}
        </div>
    )
    // Update comments preview upon new comment submission
    const updateComments = async () => {
        const array = await getComments(postId, postOwnerId, 2)
        array.reverse()
        setComments(array)
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
            <div class="post-middle"></div>
            <div class="post-bottom">
                <PostButtons user={user} postId={postId} postOwnerId={postOwnerId} />
                <div class="post-likes"></div>
                <Link class="post-view-comments" to={`/${postOwnerId}/${id}`}>
                    View more comments...
                </Link>
                {commentsPreview}
                <CommentsBar user={user} postId={postId} postOwnerId={postOwnerId} updateComments={updateComments} />
            </div>
        </div>
    )
}

export { PostReel }