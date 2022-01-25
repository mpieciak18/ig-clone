import { storage } from "./firebase.js"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"

// Upload file to storage & return file pathname for future retrieval
const uploadFile = async (folder, file) => {
    const path = `/${folder}/${file.name}`
    const reference = ref(storage, path)
    try {
        await uploadBytes(reference, file)
        return file.name
    } catch(error) {
        return null
    }
}

// Delete file from storage & return outcome
const deleteFile = async (folder, fileName) => {
    const path = `/${folder}/${fileName}`
    const reference = ref(storage, fileName)
    try {
        await deleteObject(reference)
        return 'success'
    } catch(error) {
        return 'failure'
    }
}

// Get file url from storage & return URL as string
const getUrl = async(folder, fileName) => {
    const path = `/${folder}/${fileName}`
    const reference = ref(storage, path)
    try {
        const url = await getDownloadURL(reference)
        return url
    } catch(error) {
        return null
    }
}

export { uploadFile, deleteFile, getUrl }