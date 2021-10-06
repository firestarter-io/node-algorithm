/*
 * Firestarter.io
 *
 * Copyright (C) 2021 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

// --------------------------------------------------------------------------------------- //
//                                Language Configurations                                  //
// --------------------------------------------------------------------------------------- //

// Add round method to number prototype, because it should be native in JS already!
declare global {
	interface Number {
		/**
		 * Rounds the number to the specified number of decimals, or to 0 decimals if unspecified
		 */
		round;
	}
}

if (!Number.prototype.round) {
	Number.prototype.round = function (decimals: number = 0) {
		return Math.round(this * Math.pow(10, decimals)) / Math.pow(10, decimals);
	};
}

// Add lastItem method to array prototype, because it should be native in JS already!
// Another option - use core-js, which adds a get lastItem method to Array.prototype
declare global {
	interface Array<T> {
		/**
		 * Returns the last item in the array
		 */
		lastItem: () => T;
	}
}
Array.prototype.lastItem = function () {
	return this[this.length - 1];
};

// --------------------------------------------------------------------------------------- //
//                                Get leaflet working in node                              //
// --------------------------------------------------------------------------------------- //

// Create globals so leaflet can load
global.window = {
	screen: {
		// @ts-ignore
		devicePixelRatio: 1,
	},
};
global.document = {
	documentElement: {
		// @ts-ignore
		style: {},
	},
	// @ts-ignore
	getElementsByTagName: function () {
		return [];
	},
	// @ts-ignore
	createElement: function () {
		return {};
	},
};
// @ts-ignore
global.navigator = {
	userAgent: 'nodejs',
	platform: 'nodejs',
};
global.L = require('leaflet');

export {};
