# Markstagram

"A personal recreation of Instagram. Sign up and start posting today!"

This project is from the [the Odin Project](https://www.theodinproject.com) (specifically, from their [Full Stack Javascript](https://www.theodinproject.com/paths/full-stack-javascript) curriculum).

[Click here](https://www.theodinproject.com/lessons/node-path-javascript-javascript-final-project) to read more about the project specifications.

![Live preview of the Markstagran app](./client/public/images/sample.gif)

## Live App

[Click here](https://mpieciak18.github.io/markstagram/) to check out the live version of the app!

## Project Objectives

1. To recreate a fully-functional clone of Instagram that any external user can sign up for and start using.
2. To implement React.js on the front-end and for visualization of data.
3. To integrate Google Firebase as the back-end (database, file storage, & user authentication).

## Technologies Used

<p align="left"> 
<a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="50" height="50"/> </a> 
<a href="https://developer.mozilla.org/en-US/docs/Web/CSS" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="50" height="50"/> </a>
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="50" height="50"/> </a>
<a href="https://firebase.google.com/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/1119b9f84c0290e0f0b38982099a2bd027a48bf1/icons/firebase/firebase-plain.svg" alt="firebase" width="50" height="50"/> </a>
<a href="https://reactjs.org/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="react" width="50" height="50"/> </a>
</p>

## App Features

1. Enjoy responsive styling tailored for both desktop and mobile.
2. Create your own account and log in / log out whenever you please, facilitated by Google Firebase's Authentication.
3. Add posts by uploading photos & adding captions, which are stored & retrieved from Google Firebase's Firestore & Storage.
4. View a set number of posts on a given page (ie, home, profile, or saved), and load more by scrolling down the page.
5. View individual post pages and scroll through its full list of comments.
6. Comment on, like, and save posts along with clicking-to-copy URLs for sharing with others.
7. Send other users private direct messages in a chat system that updates in real-time.
8. Search for user profiles to view & users to direct message, thanks to Flux.js.

## Instructions

1. Click the "Sign Up" button to create your account, or click the "Login" button to sign back in.
2. Enjoy a limited preview of the app before signing up / logging in. Visible pages include the home pages, user profiles, and individual post pages.
3. Create your first post by clicking the "+" button (either on the top navbar if on desktop / tablet or on the bottom navbar if on mobile). Click the blank image box to select a picture to upload, then give it a caption and hit the "Upload New Post" button!
4. Click the search box in the navbar and type in a name to search for other users. In the pop-up, you'll be able to click on the user whose profile you can navigate to.
5. Access your direct messages by clicking the "word bubble" icon in the navbar, then search for a user to reach out to, and just message away! Alternatively, you can go right to a direct message conversation with someone by clicking the "paper airplane" icon in their profile.
6. Like, save, and comment on posts by using the buttons & input bar found on a post reel (found on the home page) and full post page. You can access a full post page by clicking on the image itself in a post reel or post preview (found in user profiles & saved posts page).

## Areas for Improvement

1. There is no "loading" screen or styling when the app is busy loading posts, working on uploading a post, updating the page when logging in or out, etc. Adding something to give feedback to a user that the app is loading would be huge improvement in the UX.
2. Right now, the app only supports uploading images. Supporting GIFs and videos would be a nice touch.
3. The logic for the search functionality is a bit too inclusive at the current moment. That means you can get a lot of different users in your search results by typing in a single letter, for example.
4. Images are styled with the CSS rule "object-fit: cover". This means that they'll get cropped if they are signifcantly wider or taller than a standard square (ie, aspect ratio of 1:1).

## Known Issues

1. Responsiveness is accomplished by creating separate CSS rules for screens larger vs. smaller than 800px. On mobile devices that are rotated horizontally, forms & pop-ups can be difficult to use.
2. There is no password-reset page available yet, meaning that users can potentially get locked out of their accounts.
