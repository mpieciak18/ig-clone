import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
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

    // Init ref for checking if page is already rendered
    const isInitialMount = useRef(true);

    // Initialize user state
    const [user, setUser] = useState(null)

    // Init (current user) pending state
    const [pending, setPending] = useState(true)

    // Init browser routes state
    const [routes, setRoutes] = useState(null)

    // Update user state when authUser changes
    useEffect(() => {
        setPending(true)
        onAuthStateChanged(auth, async (authUser) => {
            if (authUser != null) {
                const newUser = await findUser(authUser.uid)
                setUser(newUser)
            } else {
                setUser(null)
            }
        })
        setPending(false)
    }, [])

    // Initialize pop-ups state
    const [popUpState, setPopUpState] = useState(
        {
            newPostOn: false,
            followsOn: false,
            notifsOn: false,
            likesOn: false,
            searchOn: false
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

    // Define private route handler
    const PrivateRoute = ({ children }) => {
        if (user != null) {
            console.log(children)
            return children
        } else {
            return <Navigate to='/login' />
        }
    }

    // Update pending when user changes
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            setPending(false)
        }
    }, [user])

    // Update browser rates when pending, user, & popUpState change
    useEffect(() => {
        if (pending != true) {
            setRoutes(
                <BrowserRouter basename={process.env.PUBLIC_URL} forceRefresh={true}>
                    <Routes>
                        <Route exact path='/' 
                            element={
                                <Home user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                            }
                        />
                        <Route exact path='/messages' 
                            element={
                                <PrivateRoute>
                                    <Messages user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                                </PrivateRoute>
                            } 
                        />
                        <Route exact path='/:postOwnerId/:postId' 
                            element={
                                <Post user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                            }
                        />
                        <Route exact path='/:otherUserId' 
                            element={
                                <Profile user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                            }
                        />
                        <Route exact path='/messages/:otherUserId'
                            element={
                                <PrivateRoute>
                                    <Conversation user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                                </PrivateRoute>
                            }
                        />
                        <Route exact path='/saved'
                            element={
                                <PrivateRoute>
                                    <Saved user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                                </PrivateRoute>
                            }
                        />
                        <Route exact path='/settings'
                            element={
                                <PrivateRoute>
                                    <Settings user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                                </PrivateRoute>
                            }
                        />
                        <Route exact path='/signup'
                            element={
                                <SignUp user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                            }
                        />
                        <Route exact path='/login'
                            element={
                                <Login user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                            }
                        />
                    </Routes>
                </BrowserRouter>
            )
        } else {
            setRoutes(null)
        }
    }, [pending, user, popUpState])

    return routes
}

export { App }