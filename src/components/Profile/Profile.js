import './Profile.css'
import { Navbar } from '../other/Navbar.js'
import { PostPreview } from '../Post/children/PostPreview.js'
import { ProfileCard } from './children/ProfileCard.js'
import { ProfileButtons } from './children/ProfileButtons.js'
import { findPostsFromUser } from '../../firebase/posts.js'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Follows } from '../other/Follows.js'

const Profile = (props) => {
    const { user } = props

    // Get other user id from url parameters
    const { otherUserId } = useParams()

    // Init postsNumber state
    const [postsNumber, setPostsNumber] = useState(12)

    // Init postsArr state
    const [postsArr, setPostsArr] = useState(null)

    // Init posts component state
    const [posts, setPosts] = useState(null)

    // Init all loaded state
    const [allLoaded, setAllLoaded] = useState(false)

    // Init other user followers count state
    const [numFollowers, setNumFollowers] = useState(null)

    // Init followsOn state
    const [followsOn, setFollowsOn] = useState(false)

    // Init follows component state
    const [follows, setFollows] = useState(null)

    // Init initial tab for follows pop-up state
    const [whichTab, setWhichTab] = useState(null)
    
    // Update posts arr state when postsNumber state changes
    useEffect(async () => {
        const newPostsArr = await findPostsFromUser(otherUserId, postsNumber)
        if (newPostsArr != null) {
            setPostsArr(newPostsArr)
            if (newPostsArr.length < postsNumber) {
                setAllLoaded(true)
            }
        } else {
            setPostsArr(null)
        }
    }, [postsNumber])

    // Update posts component state on render & when postsArr state changes
    useEffect(async () => {
        if (postsArr != null) {
            setPosts(
                <div id='user-posts'>
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
        } else {
            setPosts(<div id='user-posts-empty'>This user has no posts.</div>)
        }
    }, [postsArr])

    // Load-more function that updates the posts reel
    const loadMore = () => {
        if (allLoaded == false) {
            const newPostsNumber = postsNumber + 18
            setPostsNumber(newPostsNumber)
        }
    }

    // Load more content when user reaches bottom of document
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight - 2) {
            loadMore()
      }
    })

    // Update follows component when followsOn changes
    useEffect(async () => {
        if (postsArr != null) {
            setFollows(
                <Follows
                    user={user}
                    otherUserId={otherUserId}
                    setFollowsOn={setFollowsOn}
                    initTab={whichTab}
                />
            )
        } else {
            setFollows(null)
        }
    }, [followsOn])

    return (
        <div id='profile'>
            <Navbar user={user} />
            {follows}
            <div id='profile-contents'>
                <div id='profile-contents-left'>
                    <ProfileCard 
                        otherUserId={otherUserId}
                        numFollowers={numFollowers}
                        setNumFollowers={setNumFollowers}
                        setWhichTab={setWhichTab}
                        setFollows={setFollowsOn}
                    />
                </div>
                <div id='profile-contents-right'>
                    <ProfileButtons 
                        user={user}
                        otherUserId={otherUserId}
                        numFollowers={numFollowers}
                        setNumFollowers={setNumFollowers}
                    />
                    {posts}
                </div>
            </div>
        </div>
    )
}

export { Profile }