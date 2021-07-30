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
 * Function which takes in a date and returns a unix timestamp rounded back to nearest hour in the past
 * @returns unix timestam of current time, rounded down to start of hour
 */
export const dateRoundedToHour = (date = new Date()) => {
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date.getTime();
};
