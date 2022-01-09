import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"
import Home from "./pages/Home"
import Inbox from "./pages/Inbox"
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
            true, user.id, user.data.name, user.data.username, user.data.email
        )
    } else {
        userObject = updateUserObject(false, '', '', '', '')
    }
    const [user, setUser] = useState(userObject)

    // Return new user object from arguments
    const updateUserObject = (loggedIn, id, name, username, email) => {
        return {
            loggedIn: loggedIn,
            id: id,
            name: name,
            username: username,
            email: email
        }
    }

    // Update user state when user signs in or signs out
    auth.onAuthStateChanged(async (user) => {
        // User signs in
        if (user) {
            const user = await findUser(user.uid)
            const userObject = updateUserObject(
                true, user.id, user.data.name, user.data.username, user.data.email
            )
            setUser(userObject)
        // User signs out
        } else {
            const userObject = updateUserObject(false, '', '', '', '')
            setUser(userObject)
        }
    })

    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/inbox' element={<Inbox />} />
                <Route exact path='/post' element={<Post />} />
                <Route exact path='/profile' element={<Profile />} />
                <Route exact path='/settings' element={<Settings />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App