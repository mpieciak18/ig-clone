import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers } from '../../firebase/users.js';
import { getUrl } from '../../firebase/storage.js';
import './other.css';
import { useAuth } from '../../contexts/AuthContext.js';
import { usePopUp } from '../../contexts/PopUpContext.js';

const ConvoPopup = () => {
	const { user } = useAuth();
	const { updatePopUp } = usePopUp();

	const navigate = useNavigate();

	// Init search value state
	const [value, setValue] = useState('');

	// Update search value on input change
	const updateValue = (e) => setValue(e.target.value);

	// Init results array state
	const [results, setResults] = useState(null);

	// Init results component array
	const [resultsComp, setResultsComp] = useState(null);

	// Init popup component state
	const [popup, setPopup] = useState(null);

	// Closes search
	const hideSearch = (e) => {
		updatePopUp();
	};

	// Update results when value changes
	useEffect(() => {
		if (value != null) {
			searchUsers(value).then((res) => {
				if (res.length != 0) {
					setResults(res);
				} else {
					setResults(null);
				}
			});
		} else {
			setResults(null);
		}
	}, [value]);

	const updateResultsComp = async () => {
		const newArr = await results.map(async (result) => {
			if (result.id == user.id) {
				return null;
			} else {
				const userImage = await getUrl(result.image);
				const userHandle = result.username;
				const redirect = () => {
					navigate(`/messages/${result.id}`);
					updatePopUp();
				};
				return (
					<div
						className='convo-result'
						onClick={redirect}
						key={result.id}
					>
						<img className='convo-result-image' src={userImage} />
						<div className='convo-result-name'>@ {userHandle}</div>
					</div>
				);
			}
		});
		const newResComp = await Promise.all(newArr);
		setResultsComp(newResComp);
	};

	// Update results component when results change
	useEffect(() => {
		if (results != null) {
			updateResultsComp();
		} else {
			setResultsComp(null);
		}
	}, [results]);

	// Update popup when popUpState or resultsComp changes
	useEffect(() => {
		setPopup(
			<div id='convo-popup'>
				<div id='convo-popup-parent'>
					<div id='convo-popup-top'>
						<div id='convo-popup-x-button' onClick={hideSearch}>
							✕ Cancel
						</div>
						<div id='convo-popup-title'>Message Someone</div>
						<div id='convo-popup-x-button-hidden'>✕ Cancel</div>
					</div>
					<div id='convo-popup-middle'>
						<input
							id='convo-search'
							type='text'
							placeholder='Search'
							onChange={updateValue}
						/>
					</div>
					<div id='convo-popup-bottom'>{resultsComp}</div>
				</div>
			</div>
		);
	}, [resultsComp]);

	return popup;
};

export { ConvoPopup };
