/**
 * Firestarter.io
 *
 * In memory data for a given user session
 */

// Cheat to add properties to global for debugging purposes:
const globalAny: any = global;

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
