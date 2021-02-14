/**
 * Firestarter.io
 *
 * Utility class to define a map extent, fetch its data, and build a burn matrix
 * with references required to map pixels to raster data and latlngs
 */

import * as L from 'leaflet';
import { Matrix } from 'mathjs';
import { math } from '@utils/math';
import { refitBoundsToMapTiles } from '@utils/geometry/bounds';
import { MapBounds } from 'typings/gis';

/**
 * Extent class builds an object containing all required data for a given map extent.
 * Given a LatLngBounds, Extent offers methods to fetch and store all raster data for the bounds
 * and it creates a burn matrix with coordinates corresponding the the extend bounds
 */
export class Extent {
	/**
	 * The latLngBounds of the extent (after refitting)
	 */
	readonly latLngBounds: L.LatLngBounds;
	/**
	 * The projected bounds of the extend (after refitting)
	 */
	readonly bounds: L.Bounds;
	/**
	 * The width of the projected bounds
	 */
	readonly width: number;
	/**
	 * The height of the projected bounds
	 */
	readonly height: number;
	/**
	 * The top left corner origin of the projected bounds
	 */
	readonly origin: L.Point;
	/**
	 * Matrix with the same size as the bounds of the extent representing burn status of each pixel
	 */
	public burnMatrix: Matrix;

	/**
	 * Build the instance using the latlng bounds
	 * @param latLngBounds | LatLngBounds to create area for
	 */
	constructor(originalLatLngBounds: MapBounds) {
		/**
		 * Take in a latlngbounds and refit those bounds to cleaner dimensions
		 * Height and width of bounds will be multiple of 256
		 */
		const {
			refitBounds: bounds,
			refitLatLngBounds: latLngBounds,
		} = refitBoundsToMapTiles(originalLatLngBounds);
		/**
		 * Keep all values available on instance:
		 */
		this.bounds = bounds;
		this.latLngBounds = latLngBounds;
		this.width = bounds.getSize().x;
		this.height = bounds.getSize().y;
		this.origin = bounds.getTopLeft();
		this.burnMatrix = math.zeros(this.width, this.height, 'sparse') as Matrix;
	}

	/**
	 * Will fetch all relevant data for the map extent
	 */
	public async getData() {}
}
