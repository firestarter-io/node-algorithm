/**
 * Firestarter.io
 *
 * Campaign class creates a new campaign object with all of
 * its relevant properties and methods
 */

import * as L from 'leaflet';
import { scale, extentSize } from '@config';
import { Extent } from './extent';

export class Campaign {
	seedLatLng: L.LatLng;
	extents: Extent[];

	/**
	 * Campaign class creates a new campaign object, which is the central unit of firestarter.
	 * A campaign manages its own configuration, user inputs, map extents and their associated data,
	 * timesteps, and writing campaign data to the database
	 * @param latlng | An initial latlng representing the starting point of the first first
	 */
	constructor(latlng: L.LatLng) {
		this.seedLatLng = latlng;
		this.extents = [];
	}

	/**
	 * Initialize a new campaign
	 */
	async initialize() {
		const bounds = this.seedLatLng.toBounds(extentSize);
		await this.createExtent(bounds);
	}

	/**
	 * Creates a new extent from a LatLngBounds. Automatically resizes the bounds to nearest
	 * surroundings bounds of tiles contained within the LatLngBounds, and fetches all data
	 * for the extent
	 * @param bounds | Bounds to create a new extent from
	 */
	async createExtent(bounds: L.LatLngBounds) {
		const extent = new Extent(bounds);
		this.extents.push(extent);
		await extent.fetchData();
		return extent;
	}

	/**
	 * Starts a fire at the latlng.  Creates a new extent if necessary,
	 * or grows an existing one if necessary
	 * @param latLng | The latlng location to start the fire
	 */
	async startFire(latLng: L.LatLng) {
		const bounds = this.seedLatLng.toBounds(extentSize);
		let extent = this.extents.find((extent) =>
			extent.latLngBounds.contains(latLng)
		);
		if (!extent) {
			extent = await this.createExtent(bounds);
		}
	}

	/**
	 * Compare all extents in the campaign and merge them when they overlap,
	 * called when a new extent is created or when an existing extent grows
	 */
	compareExents() {}

	/**
	 * Checks how far a point is from the edge of its surrounding extent,
	 * and grows the extent if necessary
	 */
	checkPointInExtent(point: L.Point) {}
}
