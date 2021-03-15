/**
 * Firestarter.io
 *
 * Setup and configuration
 */

import { DEMtiles } from './data';

// --------------------------------------------------------- //
//             Get leaflet working in node                   //
// --------------------------------------------------------- //

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

// ----------------------------------------------------------------//
//           Configuration options for the algorithm               //
// ----------------------------------------------------------------//

/**
 * The map scale to be used in retrieving tiles and performing calculations
 */
export const scale: number = 12;
/**
 * Size of tiles used throughout the program
 */
export const tileSize = 256;
/**
 * Global DEM tile cache
 */
export const tileCache = DEMtiles;
/**
 * Default extent size to use when creating new extents, in meters
 */
export const extentSize = 8000;

/**
 * Saves tile image data to specified storage location
 * @param {String} tileName | Name of tile in the format of X<X>Y<Y>Z<Z>
 * @param {ImageData} tileData | ImageData for tile
 */
export const saveTile = (tileName: string, tileData: ImageData): void => {
	tileCache[tileName] = tileData;
};

/**
 * Given the tile name, retrieves the tile ImageData
 * @param {String} tileName | Name of tile in the format of X<X>Y<Y>Z<Z>
 */
export const retrieveTile = (tileName: string): ImageData =>
	tileCache[tileName];

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
