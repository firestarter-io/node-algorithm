/**
 * Firestarter.io
 *
 * In memory data for a given user session
 * Will likely need to be redesigned to use an actual database
 */

import Campaign from '@core/burncode/Campaign';

/**
 * Object containing all Campaigns currently in memory
 */
export const campaigns: { [key: string]: Campaign } = {};

/**
 * Types of data required for the algorithm
 */
export enum DataGroups {
	DEM = 'DEM',
	FBFuelModels13 = 'FBFuelModels13',
	WildfireRisk = 'WildfireRisk',
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
} & { datagroups: string[] };

/**
 * Global tile cache
 */
export const tileCache: DataCache = {
	DEM: {},
	FBFuelModels13: {},
	WildfireRisk: {},
	GroundCover: {},
	datagroups: Object.values(DataGroups),
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
globalThis.campaigns = campaigns;
// @ts-ignore
globalThis.tileCache = tileCache;
// @ts-ignore
globalThis.legends = legends;
