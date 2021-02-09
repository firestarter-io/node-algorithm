/**
 * Firestarter.io
 *
 * In memory data for a given user session
 */

// Cheat to add properties to global for debugging purposes:
const globalAny: any = global;

export interface ImageDataCache {
	[key: string]: ImageData;
}

export const DEMtiles: ImageDataCache = {};
export const vegetationClassCache: ImageDataCache = {};
export const groundcoverCache: ImageDataCache = {};
export const fuelVegetationType: ImageDataCache = {};

globalAny.DEMtiles = DEMtiles;
globalAny.vegetationClassCache = vegetationClassCache;
globalAny.groundcoverCache = groundcoverCache;
