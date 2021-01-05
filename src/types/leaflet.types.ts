/**
 * Firestarter.io
 *
 * Type definition for Leaflet / GIS type variables
 */

import type { LatLngLiteral } from 'leaflet';

/**
 * Map tile coordinate object
 */
export interface TileCoord {
	x: number;
	y: number;
	z: number;
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
