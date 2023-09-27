import { createContext, useContext, useState } from 'react';

const PopUpContext = createContext();

export const PopUpProvider = ({ children }) => {
	const [popUpState, setPopUpState] = useState({
		newPostOn: false,
		followsOn: false,
		notifsOn: false,
		likesOn: false,
		searchOn: false,
		convosOn: false,
	});

	// Updates pop-ups state. If a popUpState property is passed, then said property is set to true
	const updatePopUp = (popUp = null) => {
		const newState = {};
		for (const key of Object.keys(popUpState)) {
			if (key == popUp) newState[key] = true;
			else newState[key] = false;
		}
		setPopUpState(newState);
	};

	return (
		<PopUpContext.Provider value={{ popUpState, updatePopUp }}>
			{children}
		</PopUpContext.Provider>
	);
};

export const usePopUp = () => {
	return useContext(PopUpContext);
};
