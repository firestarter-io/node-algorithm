/*
 * Firestarter.io
 *
 * Copyright (C) 2022 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

/**
 * Math utility functions
 */

import { create, all } from 'mathjs';
import * as lodash from 'lodash';

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

/**
 *
 * @param value The value to apply noise to
 * @param noiseFactor The amount of noise to apply, as a percentage - default is 10%
 * @example
 * // Returns a value between 90 and 110:
 * noise(100, 10)
 * @example
 * // Returns a value between 9 and 11
 * noise(10, 10)
 * @example
 * // Returns a value between 12% less than 77 and 12% more than 77
 * noise(77, 12)
 */
export const noise = (value: number, noiseFactor: number = 10): number => {
	const fraction = noiseFactor / 100;
	const lowValue = value * (1 - fraction);
	const highValue = value * (1 + fraction);
	return lodash.random(lowValue, highValue, true);
};

/**
 * A moore neighborhood is a 3 x 3 grid composed of a central cell and its 8 neighbors
 * This class offers some utilities for working with moore neighborhoods in javascript
 */
export class MooreNeighborhood {
	/**
	 * Convenience print function which will take an array of length 8 or 9 and print it
	 * in an easy-to-ready readout
	 * @param spec Array of 8 or 9 values to print in Moore formation
	 */
	static prettyprint(spec: any[]) {
		const row1 = JSON.stringify(spec.slice(0, 3));
		if (spec.length === 9) {
			const row2 = JSON.stringify(spec.slice(3, 6));
			const row3 = JSON.stringify(spec.slice(6, 9));
			console.log(`${row1}\n${row2}\n${row3}`);
		} else if (spec.length === 8) {
			const centerWidth = JSON.stringify(spec[1]).length;
			const row2 = `[${JSON.stringify(spec[3])}${' '.repeat(
				centerWidth + 2
			)}${JSON.stringify(spec[4])}]`;
			const row3 = JSON.stringify(spec.slice(5, 8));
			console.log(`${row1}\n${row2}\n${row3}`);
		} else {
			console.log(
				`Array size fed to prettyprint incorrect.  Length is ${spec.length}, should be 8 or 9`
			);
		}
	}
}

globalThis.MooreNeighborhood = MooreNeighborhood;
