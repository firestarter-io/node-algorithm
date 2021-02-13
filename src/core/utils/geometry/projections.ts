/**
 * Firestarter.io
 *
 * Utility functions for projections
 * Uses SphericalMercator and EPSG3857 by default
 * Adapted from leaflet/src/geo/crs/CRS.js
 * https://github.com/Leaflet/Leaflet/blob/bc918d4bdc2ba189807bc207c77080fb41ecc196/src/geo/crs/CRS.js
 */

import { LatLngLiteral } from 'leaflet';
import { PointLiteral } from '../../../types/gis';
import { EPSG3857 } from './CRS.EPSG3857';
import SphericalMercator from './SphericalMercator';

// @method latLngToPoint(latlng: LatLng, zoom: Number): Point
// Projects geographical coordinates into pixel coordinates for a given zoom.
export function latLngToPoint(
	latlng: LatLngLiteral,
	zoom: number
): PointLiteral {
	var projectedPoint = SphericalMercator.project(latlng);

	// console.log('projectedPoint', projectedPoint);

	return EPSG3857.transformation._transform(projectedPoint, scale(zoom));
}

// @method pointToLatLng(point: Point, zoom: Number): LatLng
// The inverse of `latLngToPoint`. Projects pixel coordinates on a given
// zoom into geographical coordinates.
export function pointToLatLng(
	point: PointLiteral,
	zoom: number
): LatLngLiteral {
	const untransformedPoint = EPSG3857.transformation.untransform(
		point,
		scale(zoom)
	);

	return SphericalMercator.unproject(untransformedPoint);
}

// @method project(latlng: LatLng, zoom: Number): Point
// Projects a geographical coordinate `LatLng` according to the projection
// of the map's CRS, then scales it according to `zoom` and the CRS's
// `Transformation`. The result is pixel coordinate relative to
// the CRS origin.
export function project(latlng: LatLngLiteral, zoom: number): PointLiteral {
	return latLngToPoint(latlng, zoom);
}

// @method unproject(point: Point, zoom: Number): LatLng
// Inverse of [`project`](#map-project).
export function unproject(point: PointLiteral, zoom: number): LatLngLiteral {
	return pointToLatLng(point, zoom);
}

// @method scale(zoom: Number): Number
// Returns the scale used when transforming projected coordinates into
// pixel coordinates for a particular zoom. For example, it returns
// `256 * 2^zoom` for Mercator-based CRS.
export function scale(zoom: number): number {
	return 256 * Math.pow(2, zoom);
}

// @method zoom(scale: Number): Number
// Inverse of `scale()`, returns the zoom level corresponding to a scale
// factor of `scale`.
export function zoom(scale: number): number {
	return Math.log(scale / 256) / Math.LN2;
}
