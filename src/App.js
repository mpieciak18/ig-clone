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
    // Initialize user object
    let userObject = {}
    // Call findUser() to extract user id & data (name, email, username)
    const getUserData = async (id) => {
        const user = await findUser(id)
        return user
    }
    // Return new user object with arguments
    const updateUserObject = (loggedIn, id, name, username, email) => {
        return {
            loggedIn: loggedIn,
            id: id,
            name: name,
            username: username,
            email: email
        }
    }
    // Check if user is already logged in & update user object as needed
    if (auth.currentUser != null) {
        const user = await getUserData(auth.currentUser.uid)
        userObject = updateUserObject(
            true, user.id, user.data.name, user.data.username, user.data.email
        )
    } else {
        userObject = updateUserObject(
            false, '', '', '', ''
        )
    }
    // Initialize user state with updated user object
    const [user, setUser] = useState(userObject)

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