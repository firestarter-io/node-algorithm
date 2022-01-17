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
 * Array manipulation utility functions
 */

import * as lodash from 'lodash';

/**
 * Function to resample an array or array of objects according to a static sampling interval
 *
 * Described visually by Stack Overflow question [Resampling an array of objects](https://scicomp.stackexchange.com/questions/40065/resampling-an-array-of-objects)
 * @param {Array} originalArray Array of items to resample
 * @param {Sting} sampleKey key of the item T to be used when sampling the array - value must be a number
 * @param {Number} samplingInterval The interval between items to sample at
 */
export function resample<T extends Record<K, number>, K extends keyof T>(
	/**
	 * The array to resample
	 */
	originalArray: Array<T>,
	/**
	 * The key of property in the originalArray T that is used to resample the array - must have a number value
	 */
	sortKey: K,
	/**
	 * The interval used to resample the array
	 */
	samplingInterval: number,
	/**
	 * Optional function parameter to transform the object T to something new when resampling
	 * @param item The item that will be transformed in the array
	 * @param sampleTime If the time at which the item was sampled is desired in the new object, this property specifies
	 * the property key that will be appended to the returned item containing the sampling time
	 * @returns The result of your transformation function
	 */
	transformationFunction?: (item: T, sampleTime?: number) => any
): Array<T> {
	/**
	 * Copy array
	 */
	const array = [...originalArray];

	/**
	 * Array to hold results, initialize as empty array and then add to it as we loop through the original array
	 */
	const result = [];

	let i = 0;

	/**
	 * Take the first item in the array
	 */
	let queuedItem = array[i];

	/**
	 * The very first item in the original array's time
	 */
	let t0: number = array[0][sortKey];

	/**
	 * The time of the very first item in the original array becomes the time of the first sampled item
	 */
	let latestSampleTime = t0;

	/**
	 * First item in the original array is pushed to be the first item in the results array
	 */
	result.push(
		transformationFunction
			? transformationFunction(queuedItem, latestSampleTime)
			: queuedItem
	);

	/**
	 * If we are not at the end of the array
	 */
	while (i < array.length) {
		/**
		 * Increment sample time
		 */
		latestSampleTime = latestSampleTime + samplingInterval;

		/**
		 * Iterate through next items in array until latestSampleTime >= next item in array
		 */
		while (array[i] && array[i][sortKey] <= latestSampleTime) {
			if (array[i]) {
				queuedItem = array[i];
			}
			i = i + 1;
		}

		/**
		 * Push the queued item into the results
		 */
		result.push(
			transformationFunction
				? transformationFunction(lodash.cloneDeep(queuedItem), latestSampleTime)
				: queuedItem
		);
	}

	return result;
}
