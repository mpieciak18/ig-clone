import './styles/PostPage_and_Reel.css'
import { useRef, useState, useEffect } from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import { CommentsBar } from './CommentsBar.js'
import { PostButtons } from './PostButtons.js'
import { getComments } from '../../../firebase/comments.js'
import { findUser } from '../../../firebase/users.js'
import { getUrl } from '../../../firebase/storage.js'
import { timeSince } from '../../../other/timeSince.js'
import { Likes } from './Likes.js'

const PostReel = async (props) => {
    const { postId, postText, postImage, postDate, postOwnerId, postLikes, postComments, user } = props

    // Set up ref for comment bar / comment button
    const inputRef = useRef(null)

    // Set up comments preview for underneath image
    const [comments, setComments] = useState(async () => {
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

    // Get post owner's profile image
    const postOwnerImage = (await findUser(postOwnerId)).data.image

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
        <div className="single-post-component">
            {likes}
            <div className="post-top"></div>
                <div className="post-top-left">
                    <Link className="post-user-link" to={`/${postOwnerId}`}>
                        <img className="post-user-link-avatar" src={getUrl(postOwnerImage)} />
                        <div className="post-user-link-name-and-username-parent">
                            <div className='post-user-link-name'></div>
                            <div className='post-user-link-username'></div>
                        </div>
                    </Link>
                </div>
            <div className="post-middle">
                <img className="post-image" src={getUrl(postImage)} />
            </div>
            <div className="post-bottom">
                <PostButtons user={user} postId={postId} postOwnerId={postOwnerId} inputRef={inputRef} />
                <div className="post-likes" clickLikes={() => clickLikes}>{postLikes} Likes</div>
                <div className="post-text">{postText}</div>
                <Link className="post-view-comments" to={`/${postOwnerId}/${postId}`}>
                    View more comments...
                </Link>
                {commentsPreview}
                <div id='post-date'>
                    {timeSince(postDate)}
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
    )
}

export { PostReel }