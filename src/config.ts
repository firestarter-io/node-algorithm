/**
 * Firestarter.io
 *
 * Setup and configuration
 */

import { DataGroups, tileCache } from './data';

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

// --------------------------------------------------------------------------------------- //
//                         Configuration options for the algorithm                         //
// --------------------------------------------------------------------------------------- //

/**
 * The map scale to be used in retrieving tiles and performing calculations
 */
export const scale: number = 12;

/**
 * Size of tiles used throughout the program
 */
export const tileSize = 256;

/**
 * Number of tiles to expand an extent when it grows
 */
export const tilesToExpand = 2;

/**
 * Default extent size to use when creating new extents, in meters
 */
export const extentSize = 8000;

/**
 * Saves tile image data to specified storage location
 * @param {String} tileName | Name of tile in the format of X<X>Y<Y>Z<Z>
 * @param {ImageData} tileData | ImageData for tile
 */
export const saveTile = (
	dataGroup: DataGroups,
	tileName: string,
	tileData: ImageData
): void => {
	tileCache[dataGroup][tileName] = tileData;
};

/**
 * Given the tile name, retrieves the tile ImageData
 * @param {String} tileName | Name of tile in the format of X<X>Y<Y>Z<Z>
 */
export const retrieveTile = (
	dataGroup: DataGroups,
	tileName: string
): ImageData => tileCache[dataGroup][tileName];

/**
 * Amount of time elapsed between timesteps on a Campaign
 */
export const timestepSize = 1000 * 60 * 60; // 1 hour

/**
 * Default configuration for algorithm
 */
export default {
	scale,
	tileSize,
	timestepSize,
	tileCache,
	saveTile,
	retrieveTile,
};
