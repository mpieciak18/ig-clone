import './Post.css'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { PostPage } from './children/PostPage.js'
import { findSinglePost } from '../../firebase/posts.js'
import { Navbar } from '../other/Navbar.js'

const Post = (props) => {
    const { user } = props

    const { postOwnerId, postId } = useParams()

    // Get post data from state passed via Link using useLocation
    // If nothing is passed, then query post data from database
    const post = useLocation().state.post || findSinglePost(postId, postOwnerId)

    // Set up navigate & back button
    const navigate = useNavigate()
    const goBack = () => navigate(-1)

    const backButton = (
        <div id='post-back-button' onClick={goBack}>
            <div id='back-arrow'>⇽</div>
            <div id='back-text'>Go Back</div>
        </div>
    )

    return (
        <div id="post" className="page">
            <Navbar user={user} />
            {backButton}
            <PostPage 
                postId={post.id}
                postText={post.data.text}
                postImage={post.data.image}
                postDate={post.data.date}
                postOwnerId={post.data.user}
                postLikes={post.data.likes}
                postComments={post.data.comments}
                user={user}
            />
        </div>
    )
}

export { Post }