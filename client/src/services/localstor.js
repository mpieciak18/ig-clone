// Get signed-in user's info from local storage
export const getLocalUser = () => {
	const user = localStorage.getItem('markstagramUser');
	return user;
};

// Assign signed-in user's info to local storage
export const setLocalUser = (user) => {
	localStorage.setItem('markstagramUser', user);
};

// Get signed-in user's token from local storage
export const getToken = () => {
	const user = getLocalUser();
	return user?.token;
};

export const removeLocalUser = () => {
	localStorage.removeItem('markstagramUser');
};
