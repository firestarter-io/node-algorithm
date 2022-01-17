/*
 * Firestarter.io
 *
 * Copyright (C) 2022 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

/**
 * Utility functions for working with Bounds and LatLngBounds
 * and arrays thereof
 */

import * as L from 'leaflet';
import * as xyz from 'xyz-affair';
import { MapBounds, TileCoord } from 'typings/gis';
import { scale, tileSize } from '@config';

/**
 * Takes in array of LatLngBounds objects and returns array of XYZ coordinate objects
 * for all maptiles in those bounds
 * @param {Array} latLngBoundsArray | Array of LatLngBounds objects
 * @param {Number} scale | Map zoom value for which you want to get tile coords
 */
export function getTileCoords(
	latLngBounds: L.LatLngBounds,
	scale: number
): TileCoord[] {
	var allTileCoordsUnfiltered = [];
	const mod = Math.pow(2, scale);

	const sw = latLngBounds.getSouthWest();
	const ne = latLngBounds.getNorthEast();

	const boundsAsArray = [
		[sw.lng, sw.lat],
		[ne.lng, ne.lat],
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
 * Convert a slippy map tile coord to the LatLngBounds of that tile
 * @param tileCoord | TileCoord { X, Y, Z }
 */
export function tileCoordToBounds(tileCoord: TileCoord): L.LatLngBounds {
	const { X, Y } = tileCoord;

	const topLeftLayerPoint = new L.Point(X * tileSize, Y * tileSize);

	const bottomRightLayerPoint = new L.Point(
		(X + 1) * tileSize,
		(Y + 1) * tileSize
	);

	return L.latLngBounds(
		L.CRS.EPSG3857.pointToLatLng(topLeftLayerPoint, scale),
		L.CRS.EPSG3857.pointToLatLng(bottomRightLayerPoint, scale)
	);
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
	latLngBounds: L.LatLngBounds,
	zoom: number = scale
) {
	const tileCoords = getTileCoords(latLngBounds, zoom);
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

	const refitPixelBounds: L.Bounds = L.bounds(topLeftXY, bottomRightXY);

	const refitLatLngBounds: L.LatLngBounds = L.latLngBounds(
		L.CRS.EPSG3857.pointToLatLng(topLeftXY, zoom),
		L.CRS.EPSG3857.pointToLatLng(bottomRightXY, zoom)
	);

	const refitBounds = L.bounds(
		L.CRS.EPSG3857.project(refitLatLngBounds.getNorthEast()),
		L.CRS.EPSG3857.project(refitLatLngBounds.getSouthWest())
	);

	return { refitLatLngBounds, refitBounds, refitPixelBounds };
}

/**
 * Transforms layerpoint pixel bounds to latLngBounds
 * @param pixelBounds | L.Bounds object
 */
export function pixelBoundsToLatLngBounds(pixelBounds: L.Bounds) {
	const topLeft = pixelBounds.getTopLeft();
	const bottomRight = pixelBounds.getBottomRight();

	return L.latLngBounds(
		L.CRS.EPSG3857.pointToLatLng(topLeft, scale),
		L.CRS.EPSG3857.pointToLatLng(bottomRight, scale)
	);
}

/**
 * Transforms latLngBounds to layerpoint pixel bounds
 * @param latLngBounds | L.LatLngBounds object
 */
export function latLngBoundsToPixelBounds(latLngBounds: L.LatLngBounds) {
	const nw = latLngBounds.getNorthWest();
	const se = latLngBounds.getSouthEast();

	return L.bounds(
		L.CRS.EPSG3857.latLngToPoint(nw, scale),
		L.CRS.EPSG3857.latLngToPoint(se, scale)
	);
}
