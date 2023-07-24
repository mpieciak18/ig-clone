import './Home.css'
import { findPosts } from '../../firebase/posts.js'
import { Navbar } from '../other/Navbar.js'
import { PostReel } from '../Post/children/PostReel.js'
import { UserCard } from '../Home/children/UserCard.js'
import { useEffect, useState } from 'react'

const Home = (props) => {
    const { user, setUser, popUpState, updatePopUp } = props

    // Init postsNumber state
    const [postsNumber, setPostsNumber] = useState(5)

    // Init posts array state
    const [postsArr, setPostsArr] = useState(null)

    // Init posts component state
    const [posts, setPosts] = useState(null)

    // Init all loaded state
    const [allLoaded, setAllLoaded] = useState(false)

    // Init isLoading state
    const [isLoading, setIsLoading] = useState(false)

    // Load more content when user reaches bottom of document
    const loadMore = async (e) => {
        const elem = e.target
        if (((Math.ceil(elem.scrollHeight - elem.scrollTop) == elem.clientHeight))
        && (allLoaded == false) && (isLoading == false)) {
            await setIsLoading(true)
            const newPostsNumber = await (postsNumber + 5)
            setPostsNumber(newPostsNumber)
        }
    }

    // Update postsArr state when postsNumber state changes
    useEffect(async () => {
        const newPostsArr = await findPosts(postsNumber)
        if (newPostsArr.length < postsNumber) {
            await setAllLoaded(true)
        }
        setPostsArr(newPostsArr)
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
                                popUpState={popUpState} 
                                updatePopUp={updatePopUp}
                            />
                        )
                    })}
                </div>
            )
            await setPosts(newPosts)
            setIsLoading(false)
        }
    }, [postsArr, user])

    return (
        <div id='home' className='page'>
            <Navbar user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
            <div id='home-container' onScroll={loadMore}>
                <UserCard user={user} popUpState={popUpState} updatePopUp={updatePopUp} />
                {posts}
            </div>
        </div>
    )
}

export { Home }