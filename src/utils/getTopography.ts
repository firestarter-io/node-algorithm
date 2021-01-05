/**
 * Firestarter.io
 *
 * Utility functions for getting elevation, slope, and aspect at a given location
 */

import { retrieveTile, tileCache } from '../config';
import { getTileCoord, fetchDEMTile } from './createDEM';
import { PointLiteral } from '../types/leaflet.types';

/**
 * Takes in a projected point and returns an elevation
 * @param {Object} point | L.Point
 */
export async function getElevation(point: PointLiteral): Promise<number> {
	const { X, Y, Z } = getTileCoord(point);
	const tileName = `X${X}Y${Y}Z${Z}`;

	if (!tileCache[tileName]) {
		await fetchDEMTile({ X, Y, Z });
	}

	const xyPositionOnTile = {
		x: Math.floor(point.x) - X * 256,
		y: Math.floor(point.y) - Y * 256,
	};

	const RGBA = getRGBfromImgData(
		retrieveTile[tileName],
		xyPositionOnTile.x,
		xyPositionOnTile.y
	);

	const { R, G, B } = RGBA;

	return -10000 + (R * 256 * 256 + G * 256 + B) * 0.1;
}

/**
 * Takes in ImageData object (created when saving a tile to the store), and xy coordinate
 * of point on tile, returns RGBA value of that pixel from that ImageData's Uint8ClampedArray
 * @param {Object} imgData
 * @param {Number} x
 * @param {Number} y
 */
function getRGBfromImgData(imgData: ImageData, x: number, y: number) {
	var index = y * imgData.width + x;
	var i = index * 4;
	var d = imgData.data;
	return { R: d[i], G: d[i + 1], B: d[i + 2], A: d[i + 3] };
}
