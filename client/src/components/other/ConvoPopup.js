import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userSearch } from '../../other/search.js';
import { getUrl } from '../../firebase/storage.js';
import './other.css';

const ConvoPopup = (props) => {
	const { user, updatePopUp } = props;

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
			userSearch(value).then((res) => {
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
			if (result.item.id == user.id) {
				return null;
			} else {
				const userImage = await getUrl(result.item.data.image);
				const userHandle = result.item.data.username;
				const redirect = () => {
					navigate(`/messages/${result.item.id}`);
					updatePopUp();
				};
				return (
					<div
						className='convo-result'
						onClick={redirect}
						key={result.item.id}
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
