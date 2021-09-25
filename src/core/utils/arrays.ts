/*
 * Firestarter.io
 *
 * Copyright (C) 2021 Blue Ohana, Inc.
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
	 * Optional parameter to transform the object T to something new when resampling
	 */
	transform?: {
		/**
		 * Function to transform item T to something else when returning result
		 */
		transformationFunction?: (item: T) => any;
		/**
		 * If the time at which the item was sampled is desired in the new object, this property specifies
		 * the property key that will be appended to the returned item containing the sampling time
		 */
		newSampleTimeName?: string;
	}
): Array<T> {
	/**
	 * Copy array
	 */
	const array = [...originalArray];

	/**
	 * Array to hold results, initialize as empty array and then add to it as we loop through the original array
	 */
	const result = [];

	/**
	 * Take the first item in the array
	 */
	let queuedItem = array.shift();

	/**
	 * The very first item in the original array's time
	 */
	let t0: number = queuedItem[sortKey];

	/**
	 * The time of the very first item in the original array becomes the time of the first sampled item
	 */
	let latestSampleTime = t0;

	/**
	 * Function to transform an item in the original array, as defined by the optional transform paramter. If the transform parameter is used,
	 * the transformed object is returned.  If the transform parameter is not used, the original item T is returned.
	 */
	function transformedResult() {
		/**
		 * An item in the results array, as transformed by the transform optional paramater.  If no patameter is passed,
		 * the original item T will be used
		 */
		var transformed = lodash.cloneDeep(queuedItem);

		if (transform) {
			const { transformationFunction, newSampleTimeName } = transform;

			if (transformationFunction) {
				transformed = transformationFunction(queuedItem);
			}

			if (newSampleTimeName) {
				transformed[newSampleTimeName] = latestSampleTime;
			}
		}

		return transformed;
	}

	/**
	 * First item in the original array is pushed to be the first item in the results array
	 */
	result.push(transformedResult());

	/**
	 * Recursive function to iterate over the sample time, starting from t0, until the current
	 * sample time is greater than the t of the last item in originalArray
	 */
	function shiftAndCheckAndPush() {
		/**
		 * Increment sample time
		 */
		latestSampleTime = latestSampleTime + samplingInterval;

		/**
		 * Recusive function to check if the latest sample time is greater than the next item in the array's time,
		 * and if so, to pop that item off and set the queued item to that next item
		 */
		function shiftAndCheck() {
			/**
			 * If there are still items in the original array copy
			 */
			if (array.length) {
				const nextItem = array[0];

				if (latestSampleTime >= nextItem[sortKey]) {
					array.shift();
					queuedItem = nextItem;
					shiftAndCheck();
				}
			}
		}

		/**
		 * If there are still items in the original array copy
		 */
		if (array.length) {
			/**
			 * Iterate through next items in array until latestSampleTime >= next item in array
			 */
			shiftAndCheck();

			/**
			 * Push the queued item into the results
			 */
			result.push(transformedResult());

			/**
			 * Iterate over next sampling interval
			 */
			shiftAndCheckAndPush();
		}
	}

	shiftAndCheckAndPush();

	return result;
}
