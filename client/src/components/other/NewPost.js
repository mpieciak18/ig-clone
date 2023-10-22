import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadFile } from '../../services/storage.js';
import { newPost } from '../../services/posts.js';
import { ImageInput } from './ImageInput.js';
import { CaptionFooter } from './CaptionFooter.js';
import { findUser } from '../../services/users.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { usePopUp } from '../../contexts/PopUpContext.js';

const NewPost = (props) => {
	const { user, setUser } = useAuth();
	const { updatePopUp } = usePopUp();
	const { ref } = props;

	// Init useNavigate function
	const navigate = useNavigate();

	// Init useParams
	const location = useParams();

	// Init new post pop-up component state
	const [newPostPopup, setNewPostPopup] = useState(null);

	// Init ref for ImageInput component
	const inputRef = useRef();

	// Init file state
	const [file, setFile] = useState(null);

	// Init caption field value form validation state
	const [captionPasses, setCaptionPasses] = useState(false);

	// Init name field value state
	const [caption, setCaption] = useState('');

	// OnChange event handler for for bio field on form
	const updateCaption = (e) => setCaption(e.target.value);

	// Init error message class state
	const [errorClass, setErrorClass] = useState('inactive');

	// Init form button type state
	const [button, setButton] = useState('submit');

	// Init form buttonc class state
	const [buttonClass, setButtonClass] = useState('active');

	// Upload file to storage & add new post to firebase
	const addPost = async (e) => {
		e.preventDefault();
		// Check validation first
		if (captionPasses == true && file != null) {
			const image = file.name;
			const path = `${user.id}/${image}`;
			await uploadFile(file, path);
			// Check for possible error with adding post to DB
			const postId = await newPost(caption, path);
			if (postId != null) {
				const updatedUser = await findUser(user.id);
				await setUser(updatedUser);
				updatePopUp();
				if (location.postOwnerId == null) {
					navigate(`/${user.id}/${postId}`);
				} else {
					navigate(`/${user.id}/${postId}`);
					window.location.reload();
				}
			} else {
				setErrorClass('active');
				setTimeout(() => {
					setErrorClass('inactive');
				}, 2000);
			}
		}
	};

	// Closes newPost
	const xButtonClick = () => updatePopUp();

	// Update button & button class
	useEffect(() => {
		if (file == null || captionPasses == false) {
			setButton('button');
			setButtonClass('inactive');
		} else {
			setButton('submit');
			setButtonClass('active');
		}
	}, [file, captionPasses]);

	// Update newPost component state and change scroll on body
	useEffect(() => {
		setNewPostPopup(
			<div id='new-post' ref={ref}>
				<div id='new-post-parent'>
					<div id='new-post-error' className={errorClass}>
						<p>There was an error!</p>
						<p>Please try again.</p>
					</div>
					<div id='new-post-header'>
						<div id='new-post-x-button' onClick={xButtonClick}>
							✕ Cancel
						</div>
						<div id='new-post-title'>New Post</div>
						<div id='new-post-x-button-hidden'>✕ Cancel</div>
					</div>
					<div id='new-post-divider' />
					<form id='new-post-form' onSubmit={addPost}>
						<ImageInput
							inputRef={inputRef}
							setFile={setFile}
							setErrorClass={setErrorClass}
						/>
						<div id='new-post-caption-parent'>
							<textarea
								id='new-post-caption-input'
								name='caption'
								placeholder='Enter a caption...'
								value={caption}
								onChange={updateCaption}
							/>
							<CaptionFooter
								caption={caption}
								setCaptionPasses={setCaptionPasses}
							/>
						</div>
						<button
							type={button}
							id='new-post-button'
							className={buttonClass}
						>
							Upload New Post
						</button>
					</form>
				</div>
			</div>
		);
	}, [caption, button, buttonClass, errorClass]);

	return newPostPopup;
};

export { NewPost };
