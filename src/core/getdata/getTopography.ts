/**
 * Firestarter.io
 *
 * Utility functions for getting elevation, slope, and aspect at a given location
 */

import * as L from 'leaflet';
import { LatLngLiteral, Point } from 'leaflet';
import { retrieveTile, tileCache, scale } from '../../config';
import { getTileCoord, fetchDEMTile } from './createDEM';
import { PointLiteral, Topography } from '../../types/gis.types';
import { project, unproject } from '../utils/geometry/projections';
import { Earth } from '../utils/geometry/CRS.Earth';

/**
 * Takes in a projected point and returns an elevation
 * @param {Object} point | L.Point
 */
export async function getElevation(point: PointLiteral): Promise<number> {
	const { X, Y, Z } = getTileCoord(point);
	const tileName = `${Z}/${X}/${Y}`;

	if (!tileCache[tileName]) {
		console.log(`Fetching tile ${tileName}`);
		await fetchDEMTile({ X, Y, Z });
	}

	const xyPositionOnTile = {
		x: Math.floor(point.x) - X * 256,
		y: Math.floor(point.y) - Y * 256,
	};

	const RGBA = getRGBfromImgData(
		retrieveTile(tileName),
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
 * @param {Number} x | x position of point on tile
 * @param {Number} y | y position of point on tile
 */
function getRGBfromImgData(imgData: ImageData, x: number, y: number) {
	var index = y * imgData.width + x;
	var i = index * 4;
	var d = imgData.data;
	return { R: d[i], G: d[i + 1], B: d[i + 2], A: d[i + 3] };
}

/**
 * Takes in an L.LatLng and returns { elevation, slope, aspect }
 * @param {Object} latlng | L.LatLng
 * @param userOptions | user options
 */
export async function getTopography(
	latlng: LatLngLiteral,
	zoom = scale,
	spread: number = 4
): Promise<Topography> {
	const point: PointLiteral = L.CRS.EPSG3857.latLngToPoint(latlng, zoom);

	const pixelDiff = spread;

	const projectedN = { ...point, y: point.y - pixelDiff },
		projectedS = { ...point, y: point.y + pixelDiff },
		projectedE = { ...point, x: point.x + pixelDiff },
		projectedW = { ...point, x: point.x - pixelDiff };

	const N = L.CRS.EPSG3857.pointToLatLng(projectedN as Point, zoom);
	const S = L.CRS.EPSG3857.pointToLatLng(projectedS as Point, zoom);
	const E = L.CRS.EPSG3857.pointToLatLng(projectedE as Point, zoom);
	const W = L.CRS.EPSG3857.pointToLatLng(projectedW as Point, zoom);

	const elevation = await getElevation({ x: point.x, y: point.y }),
		eleN = await getElevation(projectedN),
		eleS = await getElevation(projectedS),
		eleE = await getElevation(projectedE),
		eleW = await getElevation(projectedW);

	const dx = Earth.distance(E, W),
		dy = Earth.distance(N, S);

	const dzdx = (eleE - eleW) / dx,
		dzdy = (eleN - eleS) / dy;

	const resolution = (dx + dy) / 2;

	const slope = Math.atan(Math.sqrt(dzdx ** 2 + dzdy ** 2)) * (180 / Math.PI);
	const aspect =
		dx !== 0
			? (Math.atan2(dzdy, dzdx) * (180 / Math.PI) + 180) % 360
			: (90 * (dy > 0 ? 1 : -1) + 180) % 360;

	return { elevation, slope, aspect, resolution };
}
