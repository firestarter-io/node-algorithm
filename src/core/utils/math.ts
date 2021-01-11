/**
 * Firestarter.io
 *
 * Some basic math utility functions
 */

/**
 * Take object of value: number pairs and return same object with rounded values
 * @param object | Any object with [key: string]: number entries
 * @param places | Decimal places to round to, defaults to 0
 */
export function roundValues<T>(object: T, places?: number): T {
	Object.keys(object).forEach((entry) => {
		object[entry] = parseFloat(object[entry].toFixed(places || 0));
	});
	return object;
}
