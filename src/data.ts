/**
 * Firestarter.io
 *
 * In memory data for a given user session
 * Will likely need to be redesigned to use an actual database
 */

/**
 * Types of data required for the algorithm
 */
export enum DataGroups {
	DEM = 'DEM',
	LandfireVegetationCondition = 'LandfireVegetationCondition',
	LandfireFuelVegetationType = 'LandfireFuelVegetationType',
	GroundCover = 'GroundCover',
}

/**
 * The shape of a given data type will be of the format
 * {
 *    tileName: <tile_image_data>,
 * }
 */
export interface ImageDataCache {
	[key: string]: ImageData;
}

/**
 * The data cache must be a group of ImageDataCaches, one for each data type
 */
export type DataCache = {
	[key in DataGroups]: ImageDataCache;
};

/**
 * Global tile cache
 */
export const tileCache: DataCache = {
	DEM: {},
	LandfireVegetationCondition: {},
	LandfireFuelVegetationType: {},
	GroundCover: {},
};

/**
 * Shape of object containing legends
 */
export type Legends = {
	[key in Exclude<DataGroups, 'DEM'>]?: object;
};

/**
 * Globally available object containing legend JSONs for raster data sources
 */
export const legends = {};

// @ts-ignore
global.tileCache = tileCache;
