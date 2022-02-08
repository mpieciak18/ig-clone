import { useState } from "react"
import { getUrl } from "../../../firebase/storage.js"

const ImageInput = (props) => {
    const { user, inputRef, setFile } = props

    const [filePreview, setFilePreview] = useState(getUrl('images', user.image))

    const maxFileSize = 10 * 1024 * 1024 // 5 MB

    // Runs when user selects image to upload
    const validateImage = async () => {
        if (inputRef.current.files[0].size > maxFileSize) {
            inputRef.current.value = ''
            setFile(null)
            setFilePreview(getUrl('images', user.image))
        } else {
            setFile(inputRef.current.files[0])
            setFilePreview(URL.createObjectURL(inputRef.current.files[0]))
        }
    }

    return (
        <input 
            // ref={inputRef} 
            // type="file" 
            // id="settings-image" 
            // name="image" 
            // accept=".jpg, .jpeg, .png" 
            // onChange={validateImage}
        >
            {/* <img src={filePreview} /> */}
        </input>
    )
}

export { ImageInput }