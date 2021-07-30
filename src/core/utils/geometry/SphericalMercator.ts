/*
 * Firestarter.io
 *
 * Copyright (C) 2021 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

/**
 * Utility functions for Spherical Mercator projections
 * Adapted from /leaflet/src/geo/projection/Projection.SphericalMercator.js
 * https://github.com/Leaflet/Leaflet/blob/bc918d4bdc2ba189807bc207c77080fb41ecc196/src/geo/projection/Projection.SphericalMercator.js
 */

var earthRadius = 6378137;

const SphericalMercator = {
	R: earthRadius,
	MAX_LATITUDE: 85.0511287798,

	project: function (latlng) {
		var d = Math.PI / 180,
			max = this.MAX_LATITUDE,
			lat = Math.max(Math.min(max, latlng.lat), -max),
			sin = Math.sin(lat * d);

		return {
			x: this.R * latlng.lng * d,
			y: (this.R * Math.log((1 + sin) / (1 - sin))) / 2,
		};
	},

	unproject: function (point) {
		var d = 180 / Math.PI;

		return {
			lat: (2 * Math.atan(Math.exp(point.y / this.R)) - Math.PI / 2) * d,
			lng: (point.x * d) / this.R,
		};
	},

	// bounds: (function () {
	// 	var d = earthRadius * Math.PI;
	// 	return new Bounds([-d, -d], [d, d]);
	// })(),
};

export default SphericalMercator;
