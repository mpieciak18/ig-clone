import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext.js';

const ImageInput = (props) => {
	const { user, inputRef } = useAuth();
	const { setFile, setErrorClass } = props;

	const [filePreviewUrl, setFilePreviewUrl] = useState(null);

	const [filePreview, setFilePreview] = useState(null);

	const [imageInput, setImageInput] = useState(null);

	const [overlayClass, setOverlayClass] = useState('inactive');

	const maxFileSize = 10 * 1024 * 1024; // 5 MB

	// Returns true if passed file is an image
	const isImage = (file) => {
		const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
		if (validTypes.includes(file.type)) {
			return true;
		} else {
			return false;
		}
	};

	// Runs when user selects image to upload
	const validateImage = async () => {
		if (
			inputRef.current.files[0].size > maxFileSize ||
			isImage(inputRef.current.files[0]) == false
		) {
			inputRef.current.value = '';
			setFile(null);
			setFilePreviewUrl(user.data.image);
			setErrorClass('active');
			setTimeout(() => {
				setErrorClass('inactive');
			}, 2000);
		} else {
			setFile(inputRef.current.files[0]);
			setFilePreviewUrl(URL.createObjectURL(inputRef.current.files[0]));
		}
	};

	useEffect(() => {
		if (user != null) {
			setFilePreviewUrl(user.data.image);
		}
	}, [user]);

	useEffect(() => {
		setImageInput(
			<input
				ref={inputRef}
				type='file'
				id='settings-image-input'
				name='image'
				onChange={validateImage}
				onMouseDown={() => setOverlayClass('active')}
				onMouseUp={() => setOverlayClass('inactive')}
				onMouseOver={() => setOverlayClass('active')}
				onMouseOut={() => setOverlayClass('inactive')}
			/>
		);
	}, [inputRef]);

	useEffect(() => {
		setFilePreview(
			<img id='settings-image-preview' src={filePreviewUrl} />
		);
	}, [filePreviewUrl]);

	return (
		<div
			id='settings-image-input-parent'
			onPointerDown={() => setOverlayClass('active')}
			onPointerUp={() => setOverlayClass('inactive')}
			onMouseOver={() => setOverlayClass('active')}
			onMouseOut={() => setOverlayClass('inactive')}
		>
			{imageInput}
			{filePreview}
			<div id='settings-image-overlay' className={overlayClass} />
		</div>
	);
};

export { ImageInput };
