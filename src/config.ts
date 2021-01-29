/**
 * Firestarter.io
 *
 * Setup and configuration
 */

//  -----------Get leaflet working in node ----------------- //

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

// -------  Configuration options for the algorithm ----------------- //

import { DEMtiles } from './data';

export const scale: number = 12;
export const tileCache = DEMtiles;

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

export default {
	scale,
	tileCache,
	saveTile,
	retrieveTile,
};
