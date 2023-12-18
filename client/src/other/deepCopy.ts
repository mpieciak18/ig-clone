//@ts-ignore
export function deepCopy(obj) {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	let copy = obj.constructor();

	for (let attr in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, attr)) {
			copy[attr] = deepCopy(obj[attr]);
		}
	}

	return copy;
}
