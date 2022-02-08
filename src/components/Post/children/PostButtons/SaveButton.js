import { saveExists, addSave, removeSave } from '../../../../firebase/saves.js'
import { useState } from 'react'

const SaveButton = async (props) => {
    const { user, postId, postOwnerId, redirect } = props

    // Init saves & add functionality to the save button
    const [saveId, setSaveId] =  useState(await saveExists(saveId))
    const [saveButtonClass, setSaveButtonClass] = useState(() => {
        if (saveId != null) {
            return 'post-save-button saved'
        } else {
            return 'post-save-button not-saved'
        }
    })

    // Variable which prevents the saveButtonFunction from running more than once simultaneously
    let sbfIsRunning = false

    // Called on by saveButtonFunction and runs sbfIsRunning is false
    const addRemoveSave = async () => {
        // disable save button function while functions run
        sbfIsRunning = true
        // perform db updates & state changes
        if (saveId == null) {
            setSaveId(await addSave(postId, postOwnerId))
            setSaveButtonClass('post-save-button saved')
        } else {
            await removeSave(saveId)
            setSaveId(null)
            setSaveButtonClass('post-save-button not-saved')
        }
        // enable like button once everything is done
        sbfIsRunning = false
    }

    // Runs when save button is clicked and calls addRemoveSave() when sbfIsrunning is false
    const saveButtonFunction = () => {
        if (sbfIsRunning == false) {
            addRemoveSave()
        }
    }

    if (user.loggedIn == true) {
        return <img className={saveButtonClass} onClick={saveButtonFunction} /> 
    } else {
        return <img className="post-save-button not-saved" onClick={redirect} />
    }
}

export { SaveButton }