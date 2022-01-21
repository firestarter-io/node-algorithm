/*
 * Firestarter.io
 *
 * Copyright (C) 2022 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

import { DataGroups, tileCache } from '../data';

// --------------------------------------------------------------------------------------- //
//                         Configuration options for the algorithm                         //
// --------------------------------------------------------------------------------------- //

/**
 * The map scale to be used in retrieving tiles and performing calculations
 */
export const scale = 12;

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
