import './styles/PostPage_and_Reel.css'
import { Link, Navigate, useParams, useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { CommentsBar } from './CommentsBar.js'
import { PostButtons } from './PostButtons.js'
import { getComments } from '../../../firebase/comments.js'
import { findSinglePost } from '../../../firebase/posts.js'
import { findUser } from '../../../firebase/users.js'
import { getUrl } from '../../../firebase/storage.js'
import { timeSince } from '../../../other/timeSince.js'
import { timeSinceTrunc } from '../../../other/timeSinceTrunc.js'
import { Likes } from './Likes.js'

const PostPage = async (props) => {
    const { user } = props

    const { postOwnerId, postId } = useParams()

    // postId, postText, postImage, postDate, postOwnerId, postLikes, postComments
    const { post } = findSinglePost(postId, postOwnerId)

    // Set up ref for comment bar / comment button
    const inputRef = useRef(null)

    // Set up comments
    const [commentQuantity, setCommentQuantity] = useState(20)
    const [comments, setComments] = useState(async () => {
        const array = await getComments(postId, postOwnerId, commentQuantity)
        return array.reverse()
    })
    const [allLoaded, setAllLoaded] = useState(false)

    const commentsSection = (
        <div className="post-comments" onScroll={loadMore}>
            {comments.map(async (comment) => {
                const commenterId = comment.data.user
                const commenter = await findUser(commenterId)
                const commenterName = commenter.data.name
                const commenterImage = await getUrl(commenter.data.image)
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
        if (array.length < commentQuantity) {
            setAllLoaded(true)
        }
    }
    // Load more comments
    const loadMore = (e) => {
        const elem = e.target
        if ((Math.ceil(elem.scrollHeight - elem.scrollTop) == elem.clientHeight) &&
        (allLoaded == false)) {
            const newCommentQuantity = commentQuantity + 20
            setCommentQuantity(newCommentQuantity)
        }
    }
    useEffect(() => {
        updateComments()
    }, [commentQuantity])

    // Get post owner's profile image
    const postOwnerImage = async () => {
        const image = await (findUser(postOwnerId).data.image)
        const imgUrl = await getUrl(image) 
        return imgUrl
    }

    // Init likesOn state
    const [likesOn, setLikesOn] = useState(false)

    // Set likesOn to true
    const path = useLocation().pathname
    const clickLikes = () => {
        if (user.loggedIn == false) {
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
    }, [likesOn])

    return (
        <div className="single-post-page">
            {likes}
            <div className="post-left">
                <img className="post-image" src={async () => await getUrl(post.data.image)} />
            </div>
            <div className="post-right">
                <div className="post-right-top">
                    <Link className="post-user-link" to={`/${postOwnerId}`}>
                        <img className="post-user-link-avatar" src={postOwnerImage()} />
                        <div className="post-user-link-name-and-username-parent">
                            <div className='post-user-link-name'></div>
                            <div className='post-user-link-username'></div>
                        </div>
                    </Link>
                    <div className="post-text">{post.data.text}</div>
                </div>
                {commentsSection}
                <div className="post-right-bottom">
                    <PostButtons 
                        user={user} postId={postId} postOwnerId={postOwnerId} inputRef={inputRef} />
                    <div className="post-right-bottom-two">
                        <div className="post-likes" clickLikes={() => clickLikes}>{post.data.likes} Likes</div>
                        <div className="post-date">{timeSince(post.data.date)}</div>
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