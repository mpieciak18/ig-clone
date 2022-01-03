import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Inbox from "./pages/Inbox"
import Post from "./pages/Post"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"

const App = () => {
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