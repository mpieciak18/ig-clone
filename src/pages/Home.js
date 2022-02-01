import '../styles/pages/Home.css'
import { findPosts } from '../firebase/posts.js'
import { Navbar } from '../components/Navbar.js'
import { PostReel } from '../components/Posts/PostReel.js'
import { UserCard } from '../components/UserCard.js'
import { useEffect } from 'react'

const Home = async (props) => {
    const { user } = props

    // Init postsNumber state
    const [postsNumber, setPostsNumber] = await useState(10)

    // Init posts state
    const postsArr = await findPosts(postsNumber)
    const [posts, setPosts] = useState(postsArr)

    // Load-more function that updates the posts reel
    const loadMore = () => {
        const newPostsNumber = postsNumber + 10
        setPostsNumber(newPostsNumber)
    }

    // Load more content when user reaches bottom of document
    window.addEventListener(() => {
        if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight - 2) {
            loadMore()
      }
    })

    // Update posts state when postsNumber state changes
    useEffect(async () => {
        const newPostsArr = await findPosts(postsNumber)
        setPosts(newPostsArr)
    }, postsNumber)

    const posts = (
        <div id='home-posts'>
            {posts.map((post) => {
                return (
                    <PostReel
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
        <div id='home' class='page'>
            <Navbar user={user} />
            <UserCard user={user} />
            {posts}
        </div>
    )
}

export {Home}