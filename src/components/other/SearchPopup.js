import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { userSearch } from "../../other/search.js"
import { getUrl } from "../../firebase/storage.js"

const SearchPopup = (props) => {
    const { user, popUpState, updatePopUp, value } = props

    const navigate = useNavigate()

    // Init results array state
    const [results, setResults] = useState(null)

    // Init results component array
    const [resultsComp, setResultsComp] = useState(null)

    // Init popup component state
    const [popup, setPopup] = useState(null)

    // Closes search
    const hideSearch = (e) => {updatePopUp()}

    // Update results when value changes
    useEffect(async () => {
        if (value != null) {
            const res = await userSearch(value)
            if (res.length != 0) {
                setResults(res)
            } else {
                setResults(null)
            }
        } else {
            setResults(null)
        }
    }, [value])

    // Update results component when results change
    useEffect(async () => {
        if (results != null) {
            const newArr = await results.map(async result => {
                const userImage = await getUrl(result.item.data.image)
                const userHandle = result.item.data.username
                const redirect = () => {
                    navigate(`/${result.item.id}`)
                    window.location.reload()
                }
                return (
                    <div className="search-result" onClick={redirect} key={result.item.id}>
                        <img className="search-result-image" src={userImage} />
                        <div className="search-result-name">@ {userHandle}</div>
                    </div>
                )
            })
            const newResComp = await Promise.all(newArr)
            setResultsComp(newResComp)
        } else {
            setResultsComp(null)
        }
    }, [results])
    
    // Update popup when popUpState or resultsComp changes 
    useEffect(async () => {
        const body = document.querySelector('body')
        if (popUpState.searchOn == true) {
            await setPopup(
                <div id='search-popup'>
                    <div id='search-popup-parent'>
                        <div id='search-popup-top'>
                            <div id="search-popup-x-button" onClick={hideSearch}>✕ Cancel</div>
                            <div id="search-popup-title">Search</div>
                            <div id="search-popup-x-button-hidden">✕ Cancel</div>
                        </div>
                        <div id='search-popup-bottom'>
                            {resultsComp}
                        </div>
                    </div>
                </div>
            )
            body.style.overflow = 'hidden'
        } else {
            setPopup(null)
            body.style.overflow = 'auto'
        }
    }, [popUpState, resultsComp])

    return popup
}

export { SearchPopup }