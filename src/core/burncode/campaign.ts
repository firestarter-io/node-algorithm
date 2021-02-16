/**
 * Firestarter.io
 *
 * Campaign class creates a new campaign object with all of
 * its relevant properties and methods
 */

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
	}

	initialize() {
		const bounds = this.seedLatLng.toBounds(16000);
		const extent = new Extent(bounds);
	}
}
