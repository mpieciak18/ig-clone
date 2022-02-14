import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import {Home} from "./components/Home/Home.js"
import {Messages} from "./components/Messages/Messages.js"
import {Post} from "./components/Post/Post.js"
import {Profile} from "./components/Profile/Profile.js"
import {Settings} from "./components/Settings/Settings.js"
import {SavedPosts} from "./components/SavedPosts/SavedPosts.js"
import {SignUp} from "./components/SignUp/SignUp.js"
import {Login} from "./components/Login/Login.js"
import {Notifications} from "./components/Notifications/Notifications.js"
import {Conversation} from './components/Conversation/Conversation.js'
import { auth } from "./firebase/firebase.js"
import { findUser } from './firebase/users.js'
import { onAuthStateChanged } from "firebase/auth"

const App = () => {

    // Initialize user state
    const [user, setUser] = useState(null)

    useEffect(() => {
        onAuthStateChanged(auth, async (authUser) => {
            if (authUser != null) {
                const newUser = await findUser(authUser.uid)
                setUser(newUser)
            } else {
                setUser(null)
            }
        })
    }, [])

    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Routes>
                <Route exact path='/' element={<Home user={user} />} />
                <Route exact path='/messages' element={<Messages user={user} />} />
                <Route exact path='/:postOwnerId/:postId' element={<Post user={user} />} />
                <Route exact path='/:userId' element={<Profile user={user}/>} />
                <Route exact path='/messages/:userId' element={<Conversation user={user}/>} />
                <Route exact path='/savedposts' element={<SavedPosts user={user} />} />
                <Route exact path='/settings' element={<Settings user={user}/>} />
                <Route exact path='/notifications' element={<Notifications user={user}/>} />
                <Route exact path='/signup' element={<SignUp user={user} />} />
                <Route exact path='/login' element={<Login user={user} />} />
            </Routes>
        </BrowserRouter>
    )
}

export { App }