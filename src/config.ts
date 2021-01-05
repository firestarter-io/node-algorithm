// Configuration options for the algorithm

import { tiles } from './data';

export const scale: number = 12;
export const saveTile = (
	tileName: string,
	tileData: Uint8ClampedArray
): void => {
	tiles[tileName] = tileData;
};
export const retrieveTile = (tileName: string): Uint8ClampedArray =>
	tiles[tileName];
export const tileCache = tiles;

export default {
	scale,
	tileCache,
	saveTile,
	retrieveTile,
};
