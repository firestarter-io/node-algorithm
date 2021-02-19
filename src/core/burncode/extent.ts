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
import { createDEM } from '@core/getdata/dem';
import {
	LandfireFuelVegetationType,
	LandfireVegetationCondition,
} from '@core/getdata/rasterSources';

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
	 * Extent class builds an object containing all required data for a given map extent.
	 * Given a LatLngBounds, Extent offers methods to fetch and store all raster data for the bounds
	 * and it creates a burn matrix with coordinates corresponding the the extend bounds
	 * @param latLngBounds | LatLngBounds to create area for
	 */
	constructor(latLngBounds: L.LatLngBounds) {
		/**
		 * Take in a latlngbounds and refit those bounds to cleaner dimensions
		 * Height and width of bounds will be multiple of 256
		 */
		const {
			refitBounds: bounds,
			refitLatLngBounds: llbounds,
		} = refitBoundsToMapTiles(latLngBounds);
		/**
		 * Keep all values available on instance:
		 */
		this.bounds = bounds;
		this.latLngBounds = llbounds;
		this.width = bounds.getSize().x;
		this.height = bounds.getSize().y;
		this.origin = bounds.getTopLeft();
		this.burnMatrix = math.zeros(this.width, this.height, 'sparse') as Matrix;
	}

	/**
	 * Will fetch all relevant data for the map extent
	 */
	public async fetchData() {
		/**
		 *  Generate Digital Elevation Model for extent:
		 */
		await createDEM(this.latLngBounds);
		/**
		 *  Get Groundcover Vegetation Condition
		 */
		await LandfireVegetationCondition.fetchImage(this.latLngBounds);
		/**
		 * Get groundcover vegetation type
		 */
		await LandfireFuelVegetationType.fetchImage(this.latLngBounds);
	}

	/**
	 * Returns data sources for the extent
	 */
	public getData() {}
}
