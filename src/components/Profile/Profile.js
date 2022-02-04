import './Profile.css'
import { Navbar } from '../other/Navbar.js'
import { PostPreview } from '../Post/children/PostPreview.js'
import { ProfileCard } from './children/ProfileCard.js'
import { ProfileButtons } from './children/ProfileButtons.js'
import { findPostsFromUser } from '../../firebase/posts.js'
import { findUser } from '../../firebase/users.js'
import { useParams } from 'react-router-dom'
import { useState } from 'react'

const Profile = async (props) => {
    const { user } = props

    // Get other user id from url parameters
    const { otherUserId } = useParams()

    // Get profile user data from database
    const otherUser = await findUser(otherUserId)

    // Init postsNumber state
    const [postsNumber, setPostsNumber] = useState(18)

    // Init posts state
    const [postsArr, setPostsArr] = useState(await findPostsFromUser(postsNumber))

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
        const newPostsArr = await findPosts(postsNumber)
        setPostsArr(newPostsArr)
        if (newPostsArr.length < postsNumber) {
            setAllLoaded(true)
        }
    }, postsNumber)

    // Posts section
    const posts = (
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

    return (
        <div id='profile'>
            <Navbar user={user} />
            <div id='profile-contents'>
                <div id='profile-contents-left'>
                    <ProfileCard user={otherUser}/>
                </div>
                <div id='profile-contents-right'>
                    <ProfileButtons self={user} userId={otherUserId} />
                    {posts}
                </div>
            </div>
        </div>
    )
}

export { Profile }