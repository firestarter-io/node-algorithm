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
 * Util functions for dates and times
 */

/**
 * Function which takes in a unix timestamp and returns a unix timestamp rounded back to nearest hour in the past
 * @param date unix timestamp
 * @returns unix timestam of current time, rounded down to start of hour
 */
export const dateRoundedToHour = (timestamp: number = new Date().getTime()) => {
	const date = new Date(timestamp);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date.getTime();
};
