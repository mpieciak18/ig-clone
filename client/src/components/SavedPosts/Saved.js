import './Saved.css'
import { findSaves } from '../../firebase/saves.js'
import { findSinglePost } from '../../firebase/posts.js'
import { PostPreview } from '../Post/children/PostPreview.js'
import { useState, useEffect } from 'react'
import { Navbar } from '../other/Navbar.js'

const Saved = (props) => {
    // Redirect to signup page if not signed in
    const { user, setUser, popUpState, updatePopUp } = props

    // Init postsNumber state
    const [postsNumber, setPostsNumber] = useState(21)

    // Init postsArr state
    const [postsArr, setPostsArr] = useState(null)

    // Init posts state
    const [posts, setPosts] = useState(null)

    // Init all loaded state
    const [allLoaded, setAllLoaded] = useState(false)

    // Update posts state when postsNumber state changes
    useEffect(async () => {
        if (user != null) {
            const savedArr = await findSaves(postsNumber)
            if (savedArr != null) {
                let newPostsArr = []
                for (const save of savedArr) {
                    const result = await findSinglePost(save.data.postId, save.data.postOwner)
                    newPostsArr = [...newPostsArr, result]
                }
                setPostsArr(newPostsArr)
                if (newPostsArr.length < postsNumber) {
                    setAllLoaded(true)
                }
            } else {
                setPostsArr(null)
            }
        } else {
            setPostsArr(null)
        }
    }, [postsNumber, user])

    // Update posts component state on render & when postsArr state changes
    useEffect(async () => {
        if (postsArr != null) {
            setPosts(
                <div id='saved-posts'>
                    <div id='saved-posts-title'>Saved Posts</div>
                    <div id='saved-posts-content'>
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
                </div>
            )
        } else {
            setPosts(<div id='user-posts-empty'>This user has no posts.</div>)
        }
    }, [postsArr])

    // Load-more function that updates the posts reel
    const loadMore = () => {
        if (allLoaded == false) {
            const newPostsNumber = postsNumber + 9
            setPostsNumber(newPostsNumber)
        }
    }

    // Load more content when user reaches bottom of document
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight - 2) {
            loadMore()
      }
    })

    return (
        <div id='saved' className='page'>
            <Navbar user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
            {posts}
        </div>
    )
}

export { Saved }