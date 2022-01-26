import { useState, useRef } from 'react'
import { uploadFile } from '../firebase/storage'
import { newPost } from '../firebase/posts'

const NewPost = (props) => {
    const { newPostOn, setNewPostOn } = props

    const inputRef = useRef()

    const [file, setFile] = useState(null)

    const [isValid, setIsValid] = useState(false)

    const [filePreview, setFilePreview] = useState(null)

    const [formButton, setFormButton] = useState("button")

    const maxFileSize = 10 * 1024 * 1024 // 5 MB

    // Runs when user selects file to upload
    const validateFile = (e) => {
        if (e.target.files[0].size > maxFileSize) {
            inputRef.current.value = ''
            setFile(null)
            setIsValid(false)
            setFilePreview(null)
            setFormButton("button")
        } else {
            setFile(e.target.files[0])
            setIsValid(true)
            setFilePreview(URL.createObjectURL(e.target.files[0]))
            setFormButton("submit")
        }
    }

    // Upload file to storage & add new post to firebase
    const addPost = async (e) => {
        e.preventDefault()
        if (isValid == true) {
            const caption = e.target.caption.value
            const image = file.name
            await uploadFile('images', file)
            await newPost(caption, image)
            await setNewPostOn(false)
        } 
    }

    // Preview of uploaded file
    const inputPreview = () => {
        if (isValid == true) {
            return (
                <div id="new-post-image-preview">
                    <img src={filePreview} />
                </div>
            )
        } else {
            return (
                <div id="new-post-image-preview">
                    <img src={`${process.env.PUBLIC_URL}/assets/upload.svg`} />
                    <div>File size limit: 5 mb</div>
                </div>
            )
        }
    }

    // Closes newPost
    const hideNewPost = (e) => {
        const id = e.target.id
        if (id == "new-post" || id == "new-post-x-button") {
            setNewPostOn(false)
        }
    }

    return (
        <div id="new-post" onClick={hideNewPost}>
            <div id="new-post-pop-up">
                <div id="new-post-header">
                    <div id="new-post-title">Create New Post</div>
                    <div id="new-post-x-button">✕</div>
                </div>
                <div id="new-post-divider" />
                <form id="new-post-form" onSubmit={addPost}>
                    <input 
                        ref={inputRef} 
                        type="file" 
                        id="new-post-image" 
                        name="image" 
                        accept=".jpg, .jpeg, .png" 
                        onChange={validateFile}
                    >
                        {inputPreview}
                    </input>
                    <input type="text" id="new-post-caption" name="caption">Enter a caption...</input>
                    <button type={formButton} id="new-post-button"></button>
                </form>
            </div>
        </div>
    )
}

export { NewPost }