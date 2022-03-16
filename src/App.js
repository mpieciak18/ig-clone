import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import {Home} from "./components/Home/Home.js"
import {Messages} from "./components/Messages/Messages.js"
import {Post} from "./components/Post/Post.js"
import {Profile} from "./components/Profile/Profile.js"
import {Settings} from "./components/Settings/Settings.js"
import {Saved} from "./components/SavedPosts/Saved.js"
import {SignUp} from "./components/SignUp/SignUp.js"
import {Login} from "./components/Login/Login.js"
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

    // Initialize pop-ups state
    const [popUpState, setPopUpState] = useState(
        {
            newPostOn: false,
            followsOn: false,
            notifsOn: false,
            likesOn: false
        }
    )
    
    // Updates pop-ups state. If a popUpState property is passed, then said property is set to true
    const updatePopUp = async (popUp = null) => {
        const newState = { ...popUpState }
        for (const [key, val] of Object.entries(popUpState)) {
            if (key == popUp) {
                newState[key] = true
            } else {
                newState[key] = false
            }
        }
        setPopUpState(newState)
    }

    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Routes>
                <Route exact path='/' element={<Home user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />} />
                <Route exact path='/messages' element={<Messages user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />} />
                <Route exact path='/:postOwnerId/:postId' element={<Post user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />} />
                <Route exact path='/:otherUserId' element={<Profile user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />} />
                <Route exact path='/messages/:otherUserId' element={<Conversation user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />} />
                <Route exact path='/saved' element={<Saved user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />} />
                <Route exact path='/settings' element={<Settings user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />} />
                <Route exact path='/signup' element={<SignUp user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />} />
                <Route exact path='/login' element={<Login user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />} />
            </Routes>
        </BrowserRouter>
    )
}

export { App }