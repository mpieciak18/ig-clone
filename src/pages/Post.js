import '../styles/pages/Post.css'
import { useParams, useLocation, useHistory } from 'react-router-dom'
import { PostPage } from '../components/Posts/PostPage.js'
import { findSinglePost } from '../firebase/posts.js'
import { Navbar } from '../components/Navbar.js'

const { postOwnerId, postId } = useParams()

const Post = (props) => {
    const { user } = props

    // Get post data from state passed via Link using useLocation
    // If nothing is passed, then query post data from database
    const location = useLocation()
    const post = location.state || findSinglePost(postId, postOwnerId)

    // Set up history & back button
    const history = useHistory()
    const goBack = () => {history.goBack()}

    const BackButton = (
        <div id='post-back-button' onClick={goBack}>
            <div id='back-arrow'>⇽</div>
            <div id='back-text'>Go Back</div>
        </div>
    )

    return (
        <div id="post" class="page">
            <Navbar user={user} />
            {BackButton}
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