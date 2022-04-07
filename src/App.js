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
import { auth, loggedIn, firebaseObserver } from "./firebase/firebase.js"
import { findUser } from './firebase/users.js'

const App = () => {

    // Initialize user state
    const [user, setUser] = useState(null)

    // Init logged in state
    const [isLoggedIn, setIsLoggedIn] = useState(loggedIn())

    // Init loading state
    const [isLoading, setIsLoading] = useState(true);

    // Init browser routes state
    const [routes, setRoutes] = useState(null)

    // Update logged-in and loading states on mount
    useEffect(() => {
        firebaseObserver.subscribe('authStateChanged', result => {
            setIsLoggedIn(result)
            setIsLoading(false)
        })
        return () => { firebaseObserver.unsubscribe('authStateChanged') }
    }, [])

    // Update user when logged-in state changes
    useEffect(async () => {
        if (isLoggedIn == true) {
            const newUser = await findUser(auth.currentUser.uid)
            setUser(newUser)
        } else {
            setUser(null)
        }
    }, [isLoggedIn])

    // Initialize pop-ups state
    const [popUpState, setPopUpState] = useState(
        {
            newPostOn: false,
            followsOn: false,
            notifsOn: false,
            likesOn: false,
            searchOn: false,
            convosOn: false
        }
    )
    
    // Updates pop-ups state. If a popUpState property is passed, then said property is set to true
    const updatePopUp = (popUp = null) => {
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

    // Update browser routes when pending, user, & popUpState change
    useEffect(() => {
        if (isLoading == false && isLoggedIn == true) {
            setRoutes(
                <BrowserRouter basename={process.env.PUBLIC_URL}>
                    <Routes>
                        <Route exact path='/' element={
                            <Home user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                        } />
                        <Route exact path='/messages' element={
                            <Messages user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                        } />
                        <Route exact path='/:postOwnerId/:postId' element={
                            <Post user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                        } />
                        <Route exact path='/:otherUserId' element={
                            <Profile user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                        } />
                        <Route exact path='/messages/:otherUserId' element={
                            <Conversation user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                        } />
                        <Route exact path='/saved' element={
                            <Saved user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                        } />
                        <Route exact path='/settings' element={
                            <Settings user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                        } />
                        <Route exact path='/signup' element={
                            <SignUp user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                        } />
                        <Route exact path='/login' element={
                            <Login user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                        } />
                    </Routes>
                </BrowserRouter>
            )
        } else if (isLoading == false && isLoggedIn == false) {
            setRoutes(
                <BrowserRouter basename={process.env.PUBLIC_URL}>
                    <Routes>
                        <Route exact path='/' element={
                            <Home user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                        } />
                        <Route exact path='/messages' element={
                            <Login user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                        } />
                        <Route exact path='/:postOwnerId/:postId' element={
                            <Post user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                        } />
                        <Route exact path='/:otherUserId' element={
                            <Profile user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                        } />
                        <Route exact path='/messages/:otherUserId' element={
                            <Login user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                        } />
                        <Route exact path='/saved' element={
                            <Login user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                        } />
                        <Route exact path='/settings' element={
                            <Login user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                        } />
                        <Route exact path='/signup' element={
                            <SignUp user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                        } />
                        <Route exact path='/login' element={
                            <Login user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
                        } />
                    </Routes>
                </BrowserRouter>
            )
        } else {
            setRoutes(null)
        }
    }, [isLoading, isLoggedIn, user, popUpState])

    return routes
}

export { App }