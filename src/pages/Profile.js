import '../styles/pages/Profile.js'
import Navbar from '../components/Navbar.js'
import PostPreview from '../components/PostPreview.js'
import { findPostsFromUser } from '../firebase/posts.js'
import { findUser } from '../firebase/users.js'

const Profile = async (props) => {
    const { user } = props

    // Init postsNumber state
    const [postsNumber, setPostsNumber] = await useState(10)

    // Init posts state
    const postsArr = await findPostsFromUser(postsNumber)
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

    // Profile card section
    const ProfileCard = (
        <div id='profile-card'>
            <img id='profile-card-icon' />
            <div id='profile-card-name'></div>
            <div id='profile-card-username'></div>
            <div id='profile-card-stats'>
                <div id='profile-card-posts'></div>
                <div id='profile-card-following'></div>
                <div id='profile-card-followers'></div>
            </div>
            <div id='profile-card-bio'></div>
        </div>
    )

    // Posts section
    const Posts = (
        <div id='user-posts'>
            {posts.map((post) => {
                return (
                    <PostPreview
                        id={post.id}
                        text={post.data.text}
                        image={post.data.image}
                        date={post.data.date}
                        postOwnerId={post.data.user}
                        likes={post.data.likes}
                        comments={post.data.image}
                        user={user}
                    />
                )
            })}
        </div>
    )

    return (
        <div id='profile'>
            <Navbar user={user} />
            <div id='profile-contents'>
                {ProfileCard}
                {Posts}
                {LoadButton}
            </div>
        </div>
    )
}

export { Profile }