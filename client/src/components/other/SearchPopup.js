import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { searchUsers } from '../../services/users.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { usePopUp } from '../../contexts/PopUpContext.js';

const SearchPopup = (props) => {
	const { user } = useAuth;
	const { updatePopUp } = usePopUp();
	const { searchVal } = props;

	const navigate = useNavigate();

	const location = useParams();

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
		if (searchVal != null) {
			searchUsers(searchVal).then((res) => {
				if (res.length != 0) {
					setResults(res);
				} else {
					setResults(null);
				}
			});
		} else {
			setResults(null);
		}
	}, [searchVal]);

	const updateResultsComp = async () => {
		const newArr = await results.map(async (result) => {
			if (result.item.id == user.id) {
				return null;
			} else {
				const redirect = () => {
					updatePopUp();
					if (location.otherUserId == null) {
						navigate(`/${result.id}`);
					} else {
						navigate(`/${result.id}`);
						window.location.reload();
					}
				};
				return (
					<div
						className='search-result'
						onClick={redirect}
						key={result.id}
					>
						<img
							className='search-result-image'
							src={result.image}
						/>
						<div className='search-result-name'>
							@ {result.username}
						</div>
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
			<div id='search-popup'>
				<div id='search-popup-parent'>
					<div id='search-popup-top'>
						<div id='search-popup-x-button' onClick={hideSearch}>
							✕ Cancel
						</div>
						<div id='search-popup-title'>Search</div>
						<div id='search-popup-x-button-hidden'>✕ Cancel</div>
					</div>
					<div id='search-popup-bottom'>{resultsComp}</div>
				</div>
			</div>
		);
	}, [resultsComp]);

	return popup;
};

export { SearchPopup };
