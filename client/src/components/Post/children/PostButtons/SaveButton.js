import { saveExists, addSave, removeSave } from '../../../../firebase/saves.js';
import { useState, useEffect } from 'react';
import SaveHollow from '../../../../assets/images/save.png';
import SaveSolid from '../../../../assets/images/save-solid.png';
import { useAuth } from '../../../../contexts/AuthContext.js';

const SaveButton = (props) => {
	const { user } = useAuth();
	const { postId, postOwnerId, redirect } = props;

	// Init saveId state
	const [saveId, setSaveId] = useState(null);

	// Init isUpdating state
	const [isUpdating, setIsUpdating] = useState(false);

	// Init icon image source state
	const [img, setImg] = useState(SaveHollow);

	// Add or removes save from post
	const addRemoveSave = async () => {
		setIsUpdating(true);
		if (saveId == null) {
			const id = await addSave(postId, postOwnerId);
			setSaveId(id);
			setImg(SaveSolid);
		} else {
			await removeSave(saveId);
			setSaveId(null);
			setImg(SaveHollow);
		}
		setIsUpdating(false);
	};

	// Calls addRemoveSave() if not already running
	const saveButtonFunction = () => {
		if (user == null) {
			redirect();
		} else if (isUpdating == false) {
			addRemoveSave();
		}
	};

	useEffect(() => {
		if (user != null) {
			saveExists(postId).then(setSaveId);
		}
	}, [user]);

	useEffect(() => {
		if (saveId != null) {
			setImg(SaveSolid);
		} else {
			setImg(SaveHollow);
		}
	}, [saveId]);

	return (
		<img
			className='post-save-button'
			src={img}
			onClick={saveButtonFunction}
			onMouseDown={() => {
				if (saveId == null) {
					setImg(SaveSolid);
				} else {
					setImg(SaveHollow);
				}
			}}
			onMouseUp={() => {
				if (saveId == null) {
					setImg(SaveHollow);
				} else {
					setImg(SaveSolid);
				}
			}}
			onMouseOver={() => {
				if (saveId == null) {
					setImg(SaveSolid);
				} else {
					setImg(SaveHollow);
				}
			}}
			onMouseOut={() => {
				if (saveId == null) {
					setImg(SaveHollow);
				} else {
					setImg(SaveSolid);
				}
			}}
		/>
	);
};

export { SaveButton };
