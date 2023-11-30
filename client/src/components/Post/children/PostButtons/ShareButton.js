import { useState } from 'react';
import ShareHollow from '../../../../assets/images/dm.png';
import ShareSolid from '../../../../assets/images/dm-solid.png';

const ShareButton = (props) => {
	const { postOwnerId, postId, setLinkCopied } = props;

	// Init icon image source state
	const [img, setImg] = useState(ShareHollow);

	// Copy post's url to clipboard
	const shareButtonFunction = () => {
		const url = `${window.location.origin}/${postOwnerId}/${postId}`;
		navigator.clipboard.writeText(url);
		setLinkCopied(true);
		setTimeout(() => {
			setLinkCopied(false);
		}, 1500);
	};

	return (
		<img
			onClick={shareButtonFunction}
			className='post-share-button'
			src={img}
			onMouseDown={() => setImg(ShareSolid)}
			onMouseUp={() => setImg(ShareHollow)}
			onMouseOver={() => setImg(ShareSolid)}
			onMouseOut={() => setImg(ShareHollow)}
		/>
	);
};

export { ShareButton };
