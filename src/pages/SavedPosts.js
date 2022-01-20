import '../styles/pages/SavedPosts.css'
import { findSaves } from '../firebase/saves.js'
import { PostPreview } from '../components/PostPreview.js'
import { useLocation, Navigate } from 'react-router-dom'

const SavedPosts = async (props) => {
    // Redirect to signup page if not signed in
    const { user } = props
    if (user.loggedIn == false) {
        const path = useLocation().pathname
        return <Navigate to='/signup' state={{path: path}} />
    }

    // Init postsNumber state
    const [postsNumber, setPostsNumber] = await useState(10)

    // Init posts state
    const postsArr = await findSaves(postsNumber)
    const [posts, setPosts] = useState(postsArr)

    // Load-more function that updates the posts reel
    const loadMore = () => {
        const newPostsNumber = postsNumber + 10
        setPostsNumber(newPostsNumber)
    }

    // Load More button
    const LoadButton = (
        <div id='load-more-button' onClick={loadMore}>Load More</div>
    )

    // Update posts state when postsNumber state changes
    useEffect(async () => {
        const newPostsArr = await findPosts(postsNumber)
        setPosts(newPostsArr)
    }, postsNumber)

    const Posts = (
        <div id='saved-posts'>
            <div id='saved-posts-title'>Saved Posts</div>
            {posts.map((post) => {
                return (
                    <PostPreview
                        postId={post.id}
                        postText={post.data.text}
                        postImage={post.data.image}
                        postDate={post.data.date}
                        postOwnerId={post.data.user}
                        postLikes={post.data.likes}
                        postComments={post.data.comments}
                        user={user}
                    />
                )
            })}
        </div>
    )

    return (
        <div id='saved' class='page'>
            <Navbar user={user} />
            <UserCard user={user} />
            {Posts}
            {LoadButton}
        </div>
    )
}

export { SavedPosts }