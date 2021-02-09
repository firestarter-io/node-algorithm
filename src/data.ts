/**
 * Firestarter.io
 *
 * In memory data for a given user session
 */

import { Bounds } from 'leaflet';

// Cheat to add properties to global for debugging purposes:
const globalAny: any = global;

export interface ImageDataCache {
	[key: string]: ImageData;
}

export type ImageDataMapCache = Map<Bounds, ImageData>;

export const DEMtiles: ImageDataCache = {};
export const vegetationClassCache: ImageDataCache = {};
export const groundcoverCache: ImageDataCache = {};
export const fuelVegetationType: ImageDataMapCache = new Map();

globalAny.DEMtiles = DEMtiles;
globalAny.vegetationClassCache = vegetationClassCache;
globalAny.groundcoverCache = groundcoverCache;
