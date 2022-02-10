import { storage } from "./firebase.js"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { auth } from "./firebase.js"

// Upload file to storage & return file pathname for future retrieval
const uploadFile = async (file, path) => {
    const reference = ref(storage, path)
    try {
        await uploadBytes(reference, file)
        return file.name
    } catch(error) {
        return null
    }
}

// Delete file from storage & return outcome
const deleteFile = async (path) => {
    const reference = ref(storage, path)
    try {
        await deleteObject(reference)
        return 'success'
    } catch(error) {
        return 'failure'
    }
}

// Get file url from storage & return URL as string
const getUrl = async (path) => {
    const reference = ref(storage, path)
    try {
        const url = await getDownloadURL(reference)
        return url
    } catch(error) {
        return error
    }
}

export { uploadFile, deleteFile, getUrl }