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
 * Type definition for Leaflet / GIS type variables
 */

import type { LatLngLiteral } from 'leaflet';

/**
 * Map tile coordinate object
 */
export interface TileCoord {
	X: number;
	Y: number;
	Z: number;
}

/**
 * Abridged Point object (just coordinates, no methods)
 */
export interface PointLiteral {
	x: number;
	y: number;
}

/**
 * Abridged map bounds object (just coordinates, no methods)
 */
export interface MapBounds {
	_southWest: LatLngLiteral;
	_northEast: LatLngLiteral;
}

/**
 * Topography results object
 */
export interface Topography {
	slope: number;
	aspect: number;
	elevation: number;
	resolution: number;
}
