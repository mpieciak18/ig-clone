// Get signed-in user's info from local storage
export const getLocalUser = () => {
	const user = localStorage.getItem('markstagramUser');
	return user;
};
