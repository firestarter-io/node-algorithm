/**
 * Firestarter.io
 *
 * EPSG3857 CRS Util definitions
 * Adapted from leaflet/src/geo/crs/CRS.EPSG3857.js
 * https://github.com/Leaflet/Leaflet/blob/bc918d4bdc2ba189807bc207c77080fb41ecc196/src/geo/crs/CRS.EPSG3857.js
 */

import SphericalMercator from './SphericalMercator';
import { toTransformation } from './Transformation';

/*
 * @namespace CRS
 * @crs L.CRS.EPSG3857
 *
 * The most common CRS for online maps, used by almost all free and commercial
 * tile providers. Uses Spherical Mercator projection. Set in by default in
 * Map's `crs` option.
 */

export const EPSG3857 = {
	code: 'EPSG:3857',
	projection: SphericalMercator,
	transformation: (function () {
		var scale = 0.5 / (Math.PI * SphericalMercator.R);
		return toTransformation(scale, 0.5, -scale, 0.5);
	})(),
};
