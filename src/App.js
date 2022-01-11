import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"
import Home from "./pages/Home"
import Messages from "./pages/Messages"
import Post from "./pages/Post"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"
import { auth } from "./firebase/firebase.js"
import { findUser } from './firebase/users.js'

const App = async () => {
    // Initialize user state
    let userObject = {}
    if (auth.currentUser != null) {
        const user = await findUser(auth.currentUser.uid)
        userObject = updateUserObject(
            true, 
            user.id, 
            user.data.name, 
            user.data.username, 
            user.data.email, 
            user.data.image, 
            user.data.followers
        )
    } else {
        userObject = updateUserObject(false, '', '', '', '', '', '')
    }
    const [user, setUser] = useState(userObject)

    // Return new user object from arguments
    const updateUserObject = (loggedIn, id, name, username, email, image, followers) => {
        return {
            loggedIn: loggedIn,
            id: id,
            name: name,
            username: username,
            email: email, 
            image: image,
            followers: followers
        }
    }

    // Update user state when user signs in or signs out
    auth.onAuthStateChanged(async (user) => {
        // User signs in
        if (user) {
            const user = await findUser(user.uid)
            const userObject = updateUserObject(
                true, 
                user.id, 
                user.data.name, 
                user.data.username, 
                user.data.email, 
                user.data.image, 
                user.data.followers
            )
            setUser(userObject)
        // User signs out
        } else {
            const userObject = updateUserObject(false, '', '', '', '', '', '')
            setUser(userObject)
        }
    })

    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Routes>
                <Route exact path='/' element={<Home user={user}/>} />
                <Route exact path='/messages' element={<Messages user={user}/>} />
                <Route exact path='/post/:postId' element={<Post user={user}/>} />
                <Route exact path='/profile/:userId' element={<Profile user={user}/>} />
                <Route exact path='/settings' element={<Settings user={user}/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App