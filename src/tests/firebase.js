import { db, auth } from '../firebase/firebase.js'

test('Initialize firestore & authentication and ensure they return as not undefined', () => {
    const input = (db != undefined) && (auth != undefined)
    const output = true
    expect(input).toBe(output)
})