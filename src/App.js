import { BrowserRouter } from "react-router-dom"

const App = () => {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>

        </BrowserRouter>
    )
}

export default App