import { useState, useEffect } from 'react';

const ImageInput = (props) => {
	const { inputRef, setFile, setErrorClass } = props;

	const [filePreviewUrl, setFilePreviewUrl] = useState(null);

	const [filePreview, setFilePreview] = useState(null);

	const [imageInput, setImageInput] = useState(null);

	const [overlayClass, setOverlayClass] = useState('inactive');

	const maxFileSize = 40 * 1024 * 1024; // 20 MB

	// Returns true if passed file is an image
	const isImage = (file) => {
		const validTypes = [
			'image/avif',
			'image/png',
			'image/jpeg',
			'image/webp',
		];
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
			setFilePreviewUrl(null);
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
		setImageInput(
			<input
				ref={inputRef}
				type='file'
				id='new-post-image-input'
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
		if (filePreviewUrl != null) {
			setFilePreview(
				<img id='new-post-image-preview' src={filePreviewUrl} />
			);
		} else {
			setFilePreview(<div id='new-post-image-preview' />);
		}
	}, [filePreviewUrl]);

	return (
		<div
			id='new-post-image-input-parent'
			onPointerDown={() => setOverlayClass('active')}
			onPointerUp={() => setOverlayClass('inactive')}
			onMouseOver={() => setOverlayClass('active')}
			onMouseOut={() => setOverlayClass('inactive')}
		>
			<label id='new-post-image-footer' htmlFor='image'>
				File size limit: 5 mb
			</label>
			{imageInput}
			{filePreview}
			<div id='new-post-image-overlay' className={overlayClass} />
		</div>
	);
};

export { ImageInput };
