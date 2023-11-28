// Get signed-in user's info from local storage
export const getLocalUser = () => {
	const user = localStorage.getItem('markstagramUser');
	return JSON.parse(user);
};

// Assign signed-in user's info to local storage
export const setLocalUser = (user) => {
	console.log(user);
	localStorage.setItem('markstagramUser', JSON.stringify(user));
};

// Get signed-in user's token from local storage
export const getToken = () => {
	const user = getLocalUser();
	return user?.token;
};

export const removeLocalUser = () => {
	localStorage.removeItem('markstagramUser');
};
