import './styles/PostPage_and_Reel.css'
import { useRef, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CommentsBar } from './CommentsBar.js'
import { PostButtons } from './PostButtons.js'
import { getComments } from '../../../firebase/comments.js'
import { findUser } from '../../../firebase/users.js'
import { getUrl } from '../../../firebase/storage.js'
import { timeSince } from '../../../other/timeSince.js'
import { Likes } from './Likes.js'

const PostReel = (props) => {
    // Init props
    const { postId, postText, postImage, postDate, postOwnerId, postLikes, postComments, user } = props

    // Init post owner state
    const [postOwner, setPostOwner] = useState(null)

    // Init post owner name
    const [postOwnerName, setPostOwnerName] = useState(null)

    // Init post owner username
    const [postOwnerUsername, setPostOwnerUsername] = useState(null)

    // Init post owner image state
    const [postOwnerImgSrc, setPostOwnerImgSrc] = useState(null)

    // Init post image state
    const [postImgSrc, setPostImgSrc] = useState(null)

    // Init post likes count state
    const [likesNum, setLikesNum] = useState(postLikes)
 
    // Update previous states on render & changes
    useEffect(async () => {
        const pOwner = await findUser(postOwnerId)
        setPostOwner(pOwner)
        setPostOwnerName(pOwner.data.name)
        setPostOwnerUsername(pOwner.data.username)
        const pOwnerImgSrc = await getUrl(pOwner.data.image)
        setPostOwnerImgSrc(pOwnerImgSrc)
        const pImgSrc = await getUrl(postImage)
        setPostImgSrc(pImgSrc)
    }, [])

    // Set up ref for comment bar / comment button
    const inputRef = useRef(null)

    // Init comments component state
    const [comments, setComments] = useState(async () => {
        const array = await getComments(postId, postOwnerId, 2)
        if (array != undefined) {
            array.reverse()
            return (
                <div class="post-comments">
                    {array.map(async (comment) => {
                        const commenterId = comment.data.user
                        const commenter = await findUser(commenterId)
                        const commenterName = commenter.name
                        return (
                            <div className='post-comment' key={comment.id}>
                                <Link to={`/profile/${commenterId}`} className='post-comment-name'>{commenterName}</Link>
                                <div className='post=comment-text'>{comment.data.text}</div>
                            </div>
                        )
                    })}
                </div>
            )
        } else {
            return null
        }
    })

    // Update comments preview arr upon new comment submission
    const updateComments = async () => {
        const array = await getComments(postId, postOwnerId, 2)
        if (array != undefined) {
            array.reverse()
            setComments(
                <div class="post-comments">
                    {array.map(async (comment) => {
                        const commenterId = comment.data.user
                        const commenter = await findUser(commenterId)
                        const commenterName = commenter.name
                        return (
                            <div className='post-comment' key={comment.id}>
                                <Link to={`/profile/${commenterId}`} className='post-comment-name'>{commenterName}</Link>
                                <div className='post=comment-text'>{comment.data.text}</div>
                            </div>
                        )
                    })}
                </div>
            )
        } else {
            setComments(null)
        }
    }

    // Init likes component state
    const [likes, setLikes] = useState(null)

    // Init likesOn state
    const [likesOn, setLikesOn] = useState(false)

    // Set likesOn to true (or redirect to signup page) when likes are clicked
    const path = useLocation().pathname
    const navigate = useNavigate()
    const clickLikes = () => {
        if (user.loggedIn == false) {
            navigate('/signup', {state: {path: path}})
        } else {
            setLikesOn(true)
        }
    }

    // Render likes pop-up preview
    useEffect(() => {
        if (likesOn == false) {
            setLikes(null)
        } else {
            setLikes(<Likes setLikesOn={setLikesOn} postId={postId} postOwnerId={postOwnerId} />)
        }
    }, [likesOn])

    return (
        <div className="single-post-component">
            {/* {likes} */}
            <div className="post-top">
                <Link className="post-user-link" to={`/${postOwnerId}`}>
                    <img className="post-user-link-avatar" src={postOwnerImgSrc} />
                    <div className="post-user-link-name-and-username-parent">
                        <div className='post-user-link-name'>{postOwnerName}</div>
                        <div className='post-user-link-username'>@{postOwnerUsername}</div>
                    </div>
                </Link>
            </div>
            <div className="post-middle">
                <img className="post-image" src={postImgSrc} />
            </div>
            <div className="post-bottom">
                <PostButtons
                    user={user}
                    postId={postId}
                    postOwnerId={postOwnerId}
                    inputRef={inputRef}
                    likesNum={likesNum}
                    setLikesNum={setLikesNum}
                />
                <div className="post-likes" onClick={() => clickLikes}>{likesNum} Likes</div>
                <div className="post-text">{postText}</div>
                <Link className="post-view-comments" to={`/${postOwnerId}/${postId}`}>
                    View more comments...
                </Link>
                {/* {comments} */}
                <div id='post-date'>
                    {timeSince(postDate)}
                </div>
                {/* <CommentsBar
                    user={user}
                    postId={postId}
                    postOwnerId={postOwnerId}
                    updateComments={updateComments}
                    inputRef={inputRef}
                /> */}
            </div>
        </div>
    )
}

export { PostReel }