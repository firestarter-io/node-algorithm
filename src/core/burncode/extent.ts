/**
 * Firestarter.io
 *
 * Utility class to define a map extent, fetch its data, and build a burn matrix
 * with references required to map pixels to raster data and latlngs
 */

import * as L from 'leaflet';
import { Matrix } from 'mathjs';
import { scale } from '../../config';

/**
 * A defined map extent with activity in a current simulation
 */
// interface Area {
//    /**
//     * The latLngBounds of the area
//     */
//    bounds: L.Bounds
//    /**
//     * Mathjs matrix, each cell represents one pixel which corresponds to the
//     * associated raster data source pixels
//     */
//    burnMatrix: Matrix
//    /**
//     * Height in pixels of the area
//     */
//    height: number;
//    /**
//     * Width in pixels of the area
//     */
//    width: number;
//    /**
//     * Origin of area, equivalent to boudnds.topLeft, required for mapping pixel position
//     * in matrix back to latlng
//     */
//    origin: L.Point;
// }

export class Extent {
	public latLngBounds: L.LatLngBounds;
	public bounds: L.Bounds;
	public width: number;
	public height: number;
	public burnMatrix: Matrix;

	/**
	 * Area class builds an object containing all required data for a given map extent.
	 * Given a LatLngBounds, Area offers methods to fetch and store all raster data for the bounds
	 * and it creates a burn matrix with coordinates mapped to its original LatLngBounds
	 * @param latLngBounds | LatLngBounds to create area for
	 */
	constructor(latLngBounds: L.LatLngBounds) {
		this.latLngBounds = latLngBounds;
		const bounds = L.bounds(
			L.CRS.EPSG3857.latLngToPoint(latLngBounds.getNorthWest(), scale),
			L.CRS.EPSG3857.latLngToPoint(latLngBounds.getSouthEast(), scale)
		);
		this.bounds = bounds;
		this.width = bounds.getSize().x;
		this.height = bounds.getSize().y;
	}

	/**
	 * Will fetch all relevant data for the map extent
	 */
	public async getData() {}
}
