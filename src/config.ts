// Get leaflet working in node:

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

// Configuration options for the algorithm

import { tiles } from './data';

export const scale: number = 12;
export const tileCache = tiles;

/**
 * Saves tile image data to specified storage location
 * @param {String} tileName | Name of tile in the format of X<X>Y<Y>Z<Z>
 * @param {ImageData} tileData | ImageData for tile
 */
export const saveTile = (tileName: string, tileData: ImageData): void => {
	tiles[tileName] = tileData;
};

/**
 * Given the tile name, retrieves the tile ImageData
 * @param {String} tileName | Name of tile in the format of X<X>Y<Y>Z<Z>
 */
export const retrieveTile = (tileName: string): ImageData => tiles[tileName];

export default {
	scale,
	tileCache,
	saveTile,
	retrieveTile,
};
