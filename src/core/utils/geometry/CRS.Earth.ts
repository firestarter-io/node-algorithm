/**
 * Firestarter.io
 *
 * Earch CRS Utils
 * Adapted from leaflet/src/geo/crs/CRS.Earth.js
 * https://github.com/Leaflet/Leaflet/blob/bc918d4bdc2ba189807bc207c77080fb41ecc196/src/geo/crs/CRS.EPSG3857.js
 */

/*
 * @namespace CRS
 * @crs L.CRS.Earth
 *
 * Serves as the base for CRS that are global such that they cover the earth.
 * Can only be used as the base for other CRS and cannot be used directly,
 * since it does not have a `code`, `projection` or `transformation`. `distance()` returns
 * meters.
 */

import { LatLngLiteral } from 'leaflet';

const R = 6371000;

export var Earth = {
	wrapLng: [-180, 180],

	// Mean Earth Radius, as recommended for use by
	// the International Union of Geodesy and Geophysics,
	// see http://rosettacode.org/wiki/Haversine_formula

	// distance between two geographical points using spherical law of cosines approximation
	distance: function (latlng1: LatLngLiteral, latlng2: LatLngLiteral): number {
		var rad = Math.PI / 180,
			lat1 = latlng1.lat * rad,
			lat2 = latlng2.lat * rad,
			sinDLat = Math.sin(((latlng2.lat - latlng1.lat) * rad) / 2),
			sinDLon = Math.sin(((latlng2.lng - latlng1.lng) * rad) / 2),
			a =
				sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon,
			c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	},
};
