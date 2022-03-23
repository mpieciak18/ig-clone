import './styles/Post.css'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { findSinglePost } from '../../firebase/posts.js'
import { Navbar } from '../other/Navbar.js'
import { useEffect, useState, useRef } from 'react'
import { findUser } from '../../firebase/users'
import { getUrl } from '../../firebase/storage'
import { Likes } from './children/Likes'
import { PostButtons } from './children/PostButtons'
import { timeSince } from '../../other/timeSince'
import { CommentsBar } from './children/Comments/CommentsBar'
import { CommentsFull } from './children/Comments/CommentsFull'
import { LinkCopied } from './children/LinkCopied'

const Post = (props) => {
    const { user, setUser, popUpState, updatePopUp } = props

    const { postOwnerId, postId } = useParams()

    // Init post owner name
    const [postOwnerName, setPostOwnerName] = useState(null)

    // Init post owner username
    const [postOwnerUsername, setPostOwnerUsername] = useState(null)

    // Init post owner image state
    const [postOwnerImage, setPostOwnerImage] = useState(null)

    // Init post image state
    const [postImage, setPostImage] = useState(null)

    // Init post likes count state
    const [postLikes, setPostLikes] = useState(null)

    // Init post comments count state
    const [postComments, setPostComments] = useState(null)

    // Init post text
    const [postText, setPostText] = useState(null)

    // Init post date
    const [postDate, setPostDate] = useState(null)

    // Set up ref for comment bar / comment button
    const inputRef = useRef(null)

    // Update previous states on render & changes
    useEffect(async () => {
        // Update post owner states
        const pOwner = await findUser(postOwnerId)
        setPostOwnerName(pOwner.data.name)
        setPostOwnerUsername(pOwner.data.username)
        const pOwnerImgSrc = await getUrl(pOwner.data.image)
        setPostOwnerImage(pOwnerImgSrc)
        // Update post states
        const post = await findSinglePost(postId, postOwnerId)
        const pImgSrc = await getUrl(post.data.image)
        setPostImage(pImgSrc)
        setPostComments(post.data.comments)
        setPostDate(post.data.date)
        setPostLikes(post.data.likes)
        setPostText(post.data.text)
    }, [])

    // Init linkCopied state for share button
    const [linkCopied, setLinkCopied] = useState(false)

    // Init likes component state
    const [likes, setLikes] = useState(null)

    // Set likesOn to true (or redirect to signup page) when likes are clicked
    const path = useLocation().pathname
    const navigate = useNavigate()
    const clickLikes = () => {
        if (user == null) {
            navigate('/signup', {state: {path: path}})
        } else {
            updatePopUp('likesOn')
        }
    }

    // Update likes state & body scroll when popUpState.likesOn changes
    useEffect(() => {
        const body = document.querySelector('body')
        if (popUpState.likesOn == true && user != null) {
            setLikes(<Likes user={user} setUser={setUser} updatePopUp={updatePopUp} postId={postId} postOwnerId={postOwnerId} />)
            body.style.overflow = 'hidden'
            
        } else {
            setLikes(null)
            body.style.overflow = 'auto'
        }
    }, [popUpState.likesOn, user])

    return (
        <div id="post" className="page">
            <Navbar user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
            {likes}
            <div id="single-post-page">
                <LinkCopied linkCopied={linkCopied} />
                <div id="content-grid">
                    <img id="post-image" src={postImage} />
                </div>
                <div id="user-grid">
                    <div id='user-grid-child'>
                        <Link id="user-link" to={`/${postOwnerId}`}>
                            <img id="user-avatar" src={postOwnerImage} />
                            <div id="user-name-parent">
                                <div id='user-name'>{postOwnerName}</div>
                                <div id='user-username'>@{postOwnerUsername}</div>
                            </div>
                        </Link>
                        <div id="date">{timeSince(postDate)}</div>
                    </div>
                </div>
                <CommentsFull 
                    postId={postId}
                    postOwnerId={postOwnerId}
                    postOwnerImage={postOwnerImage}
                    postText={postText}
                    postOwnerName={postOwnerName}
                    commentsNum={postComments}
                />
                <div id="buttons-grid">
                    <PostButtons 
                        user={user}
                        postId={postId} 
                        postOwnerId={postOwnerId}
                        inputRef={inputRef}
                        likesNum={postLikes}
                        setLikesNum={setPostLikes}
                        setLinkCopied={setLinkCopied}
                    />
                    <div id="beneath-buttons">
                        <div id="likes-count" onClick={clickLikes}>
                            {(() => {
                                if (postLikes == 0) {
                                    return (`0 likes`)
                                } else if (postLikes == 1) {
                                    return (`1 like`)
                                } else {
                                    return (`${postLikes} likes`)
                                }
                            })()}
                        </div>
                    </div>
                </div>
                <div id='comment-bar-grid'>
                    <CommentsBar
                        user={user}
                        postId={postId}
                        postOwnerId={postOwnerId}
                        commentsNum={postComments}
                        setCommentsNum={setPostComments}
                        inputRef={inputRef} 
                    />
                </div>
            </div>
        </div>
    )
}

export { Post }