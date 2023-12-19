export function deepCopy<T>(obj: T): T {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	// The constructor might not always exist, or be callable, so we add checks.
	const constructor = (obj as any).constructor;
	if (typeof constructor !== 'function') {
		throw new Error('Cannot copy object without a constructor');
	}

	// Create a new instance of the object's class
	const copy = new constructor();

	for (const attr in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, attr)) {
			// Recursive copy for properties, with type assertion
			copy[attr] = deepCopy((obj as any)[attr]);
		}
	}

	return copy as T;
}
