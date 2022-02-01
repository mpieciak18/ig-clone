import '../../styles/components/Posts/Post.css'
import { Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { CommentsBar } from './CommentsBar.js'
import { PostButtons } from './PostButtons.js'
import { getComments } from '../../firebase/comments.js'
import { getUrl } from '../../firebase/storage.js'
import { timeSince } from '../../other/timeSince.js'
import { timeSinceTrunc } from '../../other/timeSinceTrunc'
import { Likes } from './Likes.js'

const PostPage = async (props) => {
    const { postId, postText, postImage, postDate, postOwnerId, postLikes, postComments, user } = props

    // Set up ref for comment bar / comment button
    const inputRef = useRef(null)

    // Set up comments
    const [commentQuantity, setCommentQuantity] = useState(20)
    const [comments, setComments] = useState(() => {
        const array = await getComments(postId, postOwnerId, commentQuantity)
        return array.reverse()
    })
    const commentsSection = (
        <div class="post-comments" onScroll={loadMore}>
            {comments.map(async (comment) => {
                const commenterId = comment.data.user
                const commenter = await findUser(commenterId)
                const commenterName = commenter.name
                const commenterImage = await getUrl(commenter.image)
                const commentDate = timeSinceTrunc(comment.data.date)
                return (
                    <div className='post-comment'>
                        <div className='post-comment-left'>
                            <Link to={`/profile/${commenterId}`} className='post-comment-icon'>
                                <img src={commenterImage} />
                            </Link>
                            <div className='post-comment-text'>
                                <Link to={`/profile/${commenterId}`} className='post-comment-name'>{commenterName}</Link>
                                <div className='post=comment-text'>{comment.data.text}</div>
                            </div>
                        </div>
                        <div className='post-comment-date'>
                            {commentDate}
                        </div>
                    </div>
                )
            })}
        </div>
    )
    // Update comments section upon new comment submission or scroll-to-bottom
    const updateComments = async () => {
        const array = await getComments(postId, postOwnerId, commentQuantity)
        array.reverse()
        setComments(array)
    }
    // Load more comments
    const loadMore = (e) => {
        const elem = e.target
        if (Math.ceil(elem.scrollHeight - elem.scrollTop) == elem.clientHeight) {
            const newCommentQuantity = commentQuantity + 20
            setCommentQuantity(newCommentQuantity)
        }
    }
    useEffect(() => {
        updateComments()
    }, commentQuantity)

    // Get post owner's profile image
    const postOwnerImage = (await findUser(postOwnerId)).data.image

    // Init likesOn state
    const [likesOn, setLikesOn] = useState(false)

    // Set likesOn to true
    const clickLikes = () => {
        if (user.loggedIn == false) {
            const path = useLocation().pathname
            return <Navigate to='/signup' state={{path: path}} />
        } else {
            setLikesOn(true)
        }
    }

    // Render likes pop-up
    let likes = null
    useEffect(() => {
        if (likesOn == false) {
            likes = null
        } else {
            likes = <Likes setLikesOn={() => setLikesOn} postId={postId} postOwnerId={postOwnerId} />
        }
    }, likesOn)

    return (
        <div class="single-post-page">
            {likes}
            <div class="post-left">
                <img class="post-image" src={async () => await getUrl(postImage)} />
            </div>
            <div class="post-right">
                <div class="post-right-top">
                    <Link class="post-user-link" to={`/${postOwnerId}`}>
                        <img class="post-user-link-avatar" src={postOwnerImage} />
                        <div class="post-user-link-name-and-username-parent">
                            <div class='post-user-link-name'></div>
                            <div class='post-user-link-username'></div>
                        </div>
                    </Link>
                    <div class="post-text">{postText}</div>
                </div>
                {commentsSection}
                <div class="post-right-bottom">
                    <PostButtons 
                        user={user} postId={postId} postOwnerId={postOwnerId} inputRef={inputRef} />
                    <div class="post-right-bottom-two">
                        <div class="post-likes" clickLikes={() => clickLikes}>{postLikes} Likes</div>
                        <div class="post-date">{timeSince(postDate)}</div>
                    </div>
                    <CommentsBar
                        user={user}
                        postId={postId}
                        postOwnerId={postOwnerId}
                        updateComments={updateComments}
                        inputRef={inputRef} 
                    />
                </div>
            </div>
        </div>
    )
}

export { PostPage }