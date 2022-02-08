import './Home.css'
import { findPosts } from '../../firebase/posts.js'
import { Navbar } from '../other/Navbar.js'
import { PostReel } from '../Post/children/PostReel.js'
import { UserCard } from '../Home/children/UserCard.js'
import { useEffect, useState } from 'react'

const Home = (props) => {
    const { user } = props

    // Init postsNumber state
    const [postsNumber, setPostsNumber] = useState(10)

    // Init posts array state
    const [postsArr, setPostsArr] = useState(
        (async () => {
            const value = await findPosts(postsNumber)
            return value
        })()
    )

    // Init all loaded state
    const [allLoaded, setAllLoaded] = useState(false)

    // Load-more function that updates the posts reel
    const loadMore = () => {
        // if (allLoaded == false) {
        //     const newPostsNumber = postsNumber + 10
        //     setPostsNumber(newPostsNumber)
        // }
        console.log('yes')
    }

    // Load more content when user reaches bottom of document
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight - 2) {
            loadMore()
      }
    })

    // Update posts state when postsNumber state changes
    useEffect(async () => {
        const newPostsArr = await findPosts(postsNumber)
        setPostsArr(newPostsArr)
        if (newPostsArr.length < postsNumber) {
            setAllLoaded(true)
        }
    }, [postsNumber])

    const posts = (
        <div id='home-posts'>
            {(() => {
                if (postsArr.length != null) {
                    postsArr.map((post) => {
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
                    })
                }
            })()}
        )
        </div>
    )

    return (
        <div id='home' className='page'>
            <Navbar user={user} />
            <UserCard user={user} />
            {posts}
        </div>
    )
}

export { Home }