/**
 * Firestarter.io
 *
 * Burn code entry point
 */

import * as L from 'leaflet';
import { Matrix } from 'mathjs';

/**
 * A defined map extent with activity in a current simulation
 */
interface Area {
	/**
	 * The latLngBounds of the area
	 */
	bounds: L.Bounds;
	/**
	 * Mathjs matrix, each cell represents one pixel which corresponds to the
	 * associated raster data source pixels
	 */
	burnMatrix: Matrix;
	/**
	 * Height in pixels of the area
	 */
	height: number;
	/**
	 * Width in pixels of the area
	 */
	width: number;
	/**
	 * Origin of area, equivalent to boudnds.topLeft, required for mapping pixel position
	 * in matrix back to latlng
	 */
	origin: L.Point;
}
