const timeSince = (date) => {
	const seconds = Math.floor((new Date() - new Date(date)) / 1000);

	let interval = seconds / 31536000;

	// // Return as years
	// if (interval >= 2) {
	//     return `${Math.floor(interval)} years ago`
	// } else if (interval >= 1) {
	//     return "1 year ago"
	// }

	// // Return as months
	// interval = seconds / 2592000;
	// if (interval >= 2) {
	//     return `${Math.floor(interval)} months ago`
	// } else if (interval >= 1) {
	//     return "1 month ago"
	// }

	// Return as weeks
	interval = seconds / 604800;
	if (interval >= 2) {
		return `${Math.floor(interval)} weeks ago`;
	} else if (interval >= 1) {
		return '1 week ago';
	}

	// Return as days
	interval = seconds / 86400;
	if (interval >= 2) {
		return `${Math.floor(interval)} days ago`;
	} else if (interval >= 1) {
		return '1 day ago';
	}

	// Return as hours
	interval = seconds / 3600;
	if (interval >= 2) {
		return `${Math.floor(interval)} hours ago`;
	} else if (interval >= 1) {
		return '1 hour ago';
	}

	// Returns as minutes or seconds
	interval = seconds / 60;
	if (interval >= 2) {
		return `${Math.floor(interval)} minutes ago`;
	} else if (interval >= 1) {
		return '1 minute ago';
	} else if (seconds >= 2) {
		return `${Math.floor(seconds)} seconds ago`;
	} else {
		return '1 second ago';
	}
};

export { timeSince };
