/**
 * Firestarter.io
 *
 * Utility functions for getting elevation, slope, and aspect at a given location
 */

import * as L from 'leaflet';
import { LatLngLiteral, Point } from 'leaflet';
import { retrieveTile, tileCache, scale } from '@config';
import { getTileCoord, fetchDEMTile } from './dem';
import { PointLiteral, Topography } from 'typings/gis';
import { Earth } from '@utils/geometry/CRS.Earth';
import { getRGBfromImgData } from '@utils/rgba';

/**
 * Takes in a projected point and returns an elevation
 * This synchronous function assumes a DEM has already been
 * downloaded for the extent
 * @param {Object} point | L.Point
 */
export function getElevation(point: PointLiteral): number {
	const { X, Y, Z } = getTileCoord(point);
	const tileName = `${Z}/${X}/${Y}`;

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
 * Takes in an L.LatLng and returns { elevation, slope, aspect }
 * @param {Object} latlng | L.LatLng
 * @param userOptions | user options
 */
export function getTopography(
	coord: L.LatLng | L.Point,
	zoom = scale,
	spread: number = 4
): Topography {
	let point;
	if (coord instanceof L.LatLng) {
		point = L.CRS.EPSG3857.latLngToPoint(coord, zoom);
	} else if (coord instanceof L.Point) {
		point = coord;
	} else {
		console.log(
			'Something is wrong with the coordinate type fed to getTopography'
		);
	}

	const pixelDiff = spread;

	const projectedN = { ...point, y: point.y - pixelDiff },
		projectedS = { ...point, y: point.y + pixelDiff },
		projectedE = { ...point, x: point.x + pixelDiff },
		projectedW = { ...point, x: point.x - pixelDiff };

	const N = L.CRS.EPSG3857.pointToLatLng(projectedN as Point, zoom);
	const S = L.CRS.EPSG3857.pointToLatLng(projectedS as Point, zoom);
	const E = L.CRS.EPSG3857.pointToLatLng(projectedE as Point, zoom);
	const W = L.CRS.EPSG3857.pointToLatLng(projectedW as Point, zoom);

	const elevation = getElevation({ x: point.x, y: point.y }),
		eleN = getElevation(projectedN),
		eleS = getElevation(projectedS),
		eleE = getElevation(projectedE),
		eleW = getElevation(projectedW);

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
