/**
 * Firestarter.io
 *
 * Utility functions for working with Bounds and LatLngBounds
 * and arrays thereof
 */

import * as L from 'leaflet';
import * as xyz from 'xyz-affair';
import { MapBounds, TileCoord } from 'typings/gis';
import { scale } from '@config';

/**
 * Takes in array of LatLngBounds objects and returns array of XYZ coordinate objects
 * for all maptiles in those bounds
 * @param {Array} latLngBoundsArray | Array of LatLngBounds objects
 * @param {Number} scale | Map zoom value for which you want to get tile coords
 */
export function getTileCoords(
	latLngBounds: MapBounds,
	scale: number
): TileCoord[] {
	var allTileCoordsUnfiltered = [];
	const mod = Math.pow(2, scale);

	const { _southWest, _northEast } = latLngBounds;

	const boundsAsArray = [
		[_southWest.lng, _southWest.lat],
		[_northEast.lng, _northEast.lat],
	];

	let tileCoords = xyz(boundsAsArray, scale);

	// correct for any negative coordinate values
	tileCoords = tileCoords.map((c) => ({
		x: ((c.x % mod) + mod) % mod,
		y: ((c.y % mod) + mod) % mod,
		z: c.z,
	}));

	allTileCoordsUnfiltered = [...allTileCoordsUnfiltered, ...tileCoords];

	// filter duplicate values
	const filteredTileCoords = allTileCoordsUnfiltered.filter(
		(elem, index, self) =>
			self.findIndex((t) => {
				return t.x === elem.x && t.y === elem.y && t.z === elem.z;
			}) === index
	);

	return filteredTileCoords.map((c) => ({ X: c.x, Y: c.y, Z: c.z }));
}

/**
 * Function that simplifies array of map extents.  If extends overlap,
 * (or if they overlap after being padded), combine them into a single extend
 * @param latLngBoundsArray | MapBounds array object
 */
export function simplifyBoundsArray(
	latLngBoundsArray: MapBounds[],
	padding: number = 0
): MapBounds[] {
	let simplifiedBounds = [];
	let mergedBoundsIndices = [];
	latLngBoundsArray.forEach((bounds, ind) => {
		latLngBoundsArray.forEach((b, i) => {
			if (ind !== i) {
				let boundsWProto = L.latLngBounds(bounds._southWest, bounds._northEast);
				let bWProto = L.latLngBounds(b._southWest, b._northEast);
				let paddedBounds = boundsWProto.pad(padding);
				let paddedB = bWProto.pad(padding);

				if (paddedBounds.intersects(paddedB)) {
					const mergedBounds = boundsWProto.extend(bWProto);
					simplifiedBounds.push(mergedBounds);
					mergedBoundsIndices.push(ind);
					mergedBoundsIndices.push(i);
				}
			}
		});
	});
	mergedBoundsIndices.forEach((i) => {
		latLngBoundsArray.splice(i, 1);
	});
	latLngBoundsArray.push(...simplifiedBounds);
	return latLngBoundsArray;
}

/**
 * Takes in an array of latlng bounds, remaps the bounds to the bounds of the
 * map tiles that they contain
 * @param latLngBoundsArray | Array of lat lng bounds
 * @param scale | Map scale
 */
export function refitBoundsToMapTiles(
	latLngBounds: MapBounds,
	zoom: number = scale
) {
	const tileCoords = getTileCoords(latLngBounds, zoom);
	console.log(tileCoords);
	const topLeftTile = tileCoords.reduce(function (prev, curr) {
		return prev.X > curr.X && prev.Y > curr.Y ? curr : prev;
	});
	const bottomRightTile = tileCoords.reduce(function (prev, curr) {
		return prev.X > curr.X && prev.Y > curr.Y ? prev : curr;
	});

	const topLeftXY = new L.Point(topLeftTile.X * 256, topLeftTile.Y * 256);
	const bottomRightXY = new L.Point(
		(bottomRightTile.X + 1) * 256,
		(bottomRightTile.Y + 1) * 256
	);

	const refitBounds = L.latLngBounds(
		L.CRS.EPSG3857.pointToLatLng(topLeftXY, zoom),
		L.CRS.EPSG3857.pointToLatLng(bottomRightXY, zoom)
	);

	// console.log(bottomRightXY.subtract(topLeftXY));
	console.log(L.bounds(topLeftXY, bottomRightXY).getSize());

	return refitBounds;
}
