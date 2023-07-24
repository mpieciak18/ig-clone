import Fuse from 'fuse.js'
import { findAllUsers } from '../firebase/users.js'

const userSearch = async (val) => {
    const list = await findAllUsers()

    const options = {
        includeScore: true,
        keys: ['data.name', 'data.username']
    }
    
    const fuse = new Fuse(list, options)

    const result = await fuse.search(val)

    return result
}

export { userSearch }