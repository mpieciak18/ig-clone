import './SavedPosts.css'
import { findSaves } from '../../firebase/saves.js'
import { PostPreview } from '../Post/children/PostPreview.js'
import { useLocation, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Navbar } from '../other/Navbar.js'
import { ProfileCard } from '../Profile/children/ProfileCard.js'
import { findPostsFromUser } from '../../firebase/posts.js'

const SavedPosts = (props) => {
    // Redirect to signup page if not signed in
    const { user } = props
    const path = useLocation().pathname
    const redirect = () => <Navigate to='/signup' state={{path: path}} />
    if (user.loggedIn == false) {
        redirect() 
    }

    // Init postsNumber state
    const [postsNumber, setPostsNumber] = useState(18)

    // Init posts state
    const [postsArr, setPostsArr] = useState(async () => await findSaves(postsNumber))

    // Init all loaded state
    const [allLoaded, setAllLoaded] = useState(false)

    // Load-more function that updates the posts reel
    const loadMore = () => {
        if (allLoaded == false) {
            const newPostsNumber = postsNumber + 18
            setPostsNumber(newPostsNumber)
        }
    }

    // Load more content when user reaches bottom of document
    window.addEventListener(() => {
        if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight - 2) {
            loadMore()
      }
    })

    // Update posts state when postsNumber state changes
    useEffect(async () => {
        const newPostsArr = await findPostsFromUser(postsNumber)
        setPostsArr(newPostsArr)
        if (newPostsArr.length < postsNumber) {
            setAllLoaded(true)
        }
    }, [postsNumber])

    const posts = (
        <div id='saved-posts'>
            <div id='saved-posts-title'>Saved Posts</div>
            {postsArr.map((post) => {
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
        <div id='saved' className='page'>
            <Navbar user={user} />
            <ProfileCard user={user} />
            {posts}
        </div>
    )
}

export { SavedPosts }