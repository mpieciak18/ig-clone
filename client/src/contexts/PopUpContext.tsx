import { PropsWithChildren, createContext, useContext, useState } from 'react';

interface PopUpType {
	newPostOn: boolean;
	followsOn: boolean;
	notifsOn: boolean;
	likesOn: boolean;
	searchOn: boolean;
	convosOn: boolean;
	settingsOn: boolean;
}

interface PopUpContextType {
	popUpState: PopUpType;
	updatePopUp: (popUp?: string | null) => void;
}

const PopUpContext = createContext<PopUpContextType | undefined>(undefined);

export const PopUpProvider = ({ children }: PropsWithChildren) => {
	const [popUpState, setPopUpState] = useState<PopUpType>({
		newPostOn: false,
		followsOn: false,
		notifsOn: false,
		likesOn: false,
		searchOn: false,
		convosOn: false,
		settingsOn: false,
	});

	// Checks if the key passed to the potentially new popUp state is in fact in PopUpType
	const isKeyOfPopUpType = (key: string): key is keyof PopUpType => {
		return key in popUpState;
	};

	// Updates pop-ups state. If a popUpState property is passed, then said property is set to true
	const updatePopUp = (popUp: string | null = null) => {
		const newState: PopUpType = {
			newPostOn: false,
			followsOn: false,
			notifsOn: false,
			likesOn: false,
			searchOn: false,
			convosOn: false,
			settingsOn: false,
		};
		for (const key of Object.keys(popUpState)) {
			if (isKeyOfPopUpType(key)) {
				newState[key] = key === popUp;
			}
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
