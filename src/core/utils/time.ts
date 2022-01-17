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
 * Util functions for dates and times
 */

/**
 * Utility functions for rounding dates and times to nearest second, minute, hour, day, etc.
 */
export const roundTime = {
	/**
	 * Function which takes in a unix timestamp and returns a unix timestamp rounded back to nearest second in the past
	 * @param date unix timestamp
	 * @returns unix timestam of current time, rounded down to start of second
	 */
	bySecond: (timestamp: number = new Date().getTime()) => {
		const date = new Date(timestamp);
		date.setMilliseconds(0);
		return date.getTime();
	},

	/**
	 * Function which takes in a unix timestamp and returns a unix timestamp rounded back to nearest minute in the past
	 * @param date unix timestamp
	 * @returns unix timestam of current time, rounded down to start of minute
	 */
	byMinute: (timestamp: number = new Date().getTime()) => {
		const date = new Date(timestamp);
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date.getTime();
	},

	/**
	 * Function which takes in a unix timestamp and returns a unix timestamp rounded back to nearest hour in the past
	 * @param date unix timestamp
	 * @returns unix timestam of current time, rounded down to start of hour
	 */
	byHour: (timestamp: number = new Date().getTime()) => {
		const date = new Date(timestamp);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date.getTime();
	},

	/**
	 * Function which takes in a unix timestamp and returns a unix timestamp rounded back to nearest hour in the past
	 * @param date unix timestamp
	 * @returns unix timestam of current time, rounded down to start of dat (12:00 AM midnight)
	 */
	byDay: (timestamp: number = new Date().getTime()) => {
		const date = new Date(timestamp);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date.getTime();
	},
};
