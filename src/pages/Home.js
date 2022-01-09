import '../styles/Home.css'
import { findPosts } from '../firebase/posts.js'
import { Navbar } from '../components/Navbar.js'
import { Post } from '../components/Post.js'

const Home = async () => {
    const { user } = props

    // Init postsNumber state
    const [postsNumber, setPostsNumber] = await useState(10)

    // Init posts state
    const postsArr = await findPosts(postsNumber)
    const [posts, setPosts] = useState(postsArr)

    const Posts = (
        <div id='home-posts'>
            {posts.map((post) => {
                return (
                    <Post 
                        id={post.id}
                        text={post.data.text}
                        image={post.data.image}
                        date={post.data.date}
                        userId={post.data.user}
                    />
                )
            })}
        </div>
    )

    return (
        <div id='home' class='page'>
            <Navbar user={user} />
            {Posts}
        </div>
    )
}