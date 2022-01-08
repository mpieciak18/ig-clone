import { signInUser, signOutUser, auth, findUser } from '../firebase/users.js'

// Added test user via Firebase console
// email: test1@test.com, password: test1234,
// uid: LoU4B92km4OEEFfM85Ll94zQMDe2

test('Sign user in, check auth.currentUser, sign user out, check auth.currentUser again', async () => {
    await signInUser('test1@test.com', 'test1234')
    const outcomeOne = (auth.currentUser != null)
    await signOutUser()
    const outcomeTwo = (auth.currentUser == null)
    expect(outcomeOne && outcomeTwo).toBeTruthy()
})

test('Find user in firestore', async () => {
    const userId = 'LoU4B92km4OEEFfM85Ll94zQMDe2'
    const userData = {
        email: "test1@test.com",
        name: "test test",
        username: "testAccount" 
    }
    const userObject = {
        id: userId,
        data: userData
    }
    const testObject = await findUser('LoU4B92km4OEEFfM85Ll94zQMDe2')
    expect(testObject).toEqual(userObject)
})