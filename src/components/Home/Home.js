import './Home.css'
import { findPosts } from '../../firebase/posts.js'
import { Navbar } from '../other/Navbar.js'
import { PostReel } from '../Post/children/PostReel.js'
import { UserCard } from '../Home/children/UserCard.js'
import { useEffect, useState } from 'react'

const Home = (props) => {
    const { user } = props

    // Init postsNumber state
    const [postsNumber, setPostsNumber] = useState(5)

    // Init posts array state
    const [postsArr, setPostsArr] = useState(
        async () => {
            const value = await findPosts(postsNumber)
            return value
        }
    )

    // Init posts component state
    const [posts, setPosts] = useState(null)

    // Init all loaded state
    const [allLoaded, setAllLoaded] = useState(false)

    // Load-more function that updates the posts reel
    const loadMore = () => {
        if (allLoaded == false) {
            const newPostsNumber = postsNumber + 5
            setPostsNumber(newPostsNumber)
        }
    }

    // Load more content when user reaches bottom of document
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight - 2) {
            loadMore()
      }
    })

    // Update postsArr state when postsNumber state changes
    useEffect(async () => {
        const newPostsArr = await findPosts(postsNumber)
        setPostsArr(newPostsArr)
        if (newPostsArr.length < postsNumber) {
            setAllLoaded('true')
        }
    }, [postsNumber])

    // Update posts component state when postArr state changes
    useEffect(async () => {
        if (postsArr != null) {
            const newPosts = (
                <div id='home-posts'>
                    {postsArr.map((post) => {
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
            setPosts(newPosts)
        }
    }, [postsArr, user])

    return (
        <div id='home' className='page'>
            <Navbar user={user} />
            <div id='home-container'>
                <UserCard user={user} />
                {posts}
            </div>
        </div>
    )
}

export { Home }