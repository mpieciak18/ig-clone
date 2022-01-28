import { useRef, useState } from "react"

const ImageInput = (props) => {
    const { user, setFile } = props

    const imageRef = useRef()

    const [filePreview, setFilePreview] = useState(await getUrl('images', user.image))

    const maxFileSize = 10 * 1024 * 1024 // 5 MB

    // Runs when user selects image to upload
    const validateImage = async (e) => {
        if (e.target.files[0].size > maxFileSize) {
            imageRef.current.value = ''
            setFile(null)
            setFilePreview(getUrl('images', user.image))
        } else {
            setFile(e.target.files[0])
            setFilePreview(URL.createObjectURL(e.target.files[0]))
        }
    }

    return (
        <input 
            ref={imageRef} 
            type="file" 
            id="settings-image" 
            name="image" 
            accept=".jpg, .jpeg, .png" 
            onChange={validateImage}
        >
            <img src={filePreview} />
        </input>
    )
}

export { ImageInput }