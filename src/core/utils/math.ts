/**
 * Firestarter.io
 *
 * Some basic math utility functions
 */

import { create, all } from 'mathjs';

export const ROOT2 = 1.4142135623730951 as const;

export const math = create(all, {});

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

/**
 * Function to compare whether two numbers are the same, returns true if the difference is less than or equal to the defined tolerance
 * @param value1 | First value
 * @param value2 | Second value
 * @param tolerance | Tolerance under which two numbers should be considered the same
 */
export function compareWithTolerance(
	value1: number,
	value2: number,
	tolerance: number
): boolean {
	return Math.abs(value1 - value2) <= Math.abs(tolerance);
}

/**
 * Compares two objects of the pattern [key]: number to see if their values match within a given tolerance
 * @param obj1 | First object to compare
 * @param obj2 | Second object to compare
 * @param tolerance | Tolerance for comparing values
 */
export function compareObjectWithTolerance<T>(
	obj1: T,
	obj2: T,
	tolerance: number
): boolean {
	const sames: Array<boolean> = [];
	Object.keys(obj1).forEach((e) => {
		if (compareWithTolerance(obj1[e], obj2[e], tolerance)) {
			sames.push(true);
		} else {
			sames.push(false);
		}
	});
	return !sames.some((c) => !c);
}
