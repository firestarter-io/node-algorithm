/**
 * Firestarter.io
 *
 * Campaign class creates a new campaign object with all of
 * its relevant properties and methods
 */

import * as L from 'leaflet';
import { scale, extentSize } from '@config';
import Extent from './Extent';
import TimeStep from './Timestep';
import { Logger } from '@core/utils/Logger';

export class Campaign {
	seedLatLng: L.LatLng;
	extents: Extent[];
	startTime: number;
	timesteps: TimeStep[];

	/**
	 * Campaign class creates a new campaign object, which is the central unit of firestarter.
	 * A campaign manages its own configuration, user inputs, map extents and their associated data,
	 * timesteps, and writing campaign data to the database
	 * @param latlng | An initial latlng representing the starting point of the first first
	 */
	constructor(latlng: L.LatLng, startTime: number = new Date().getTime()) {
		/**
		 * Campaign must be constructed from a first seed latlng
		 */
		this.seedLatLng = latlng;
		/**
		 * Initialize array of extents
		 */
		this.extents = [];
		/**
		 * Timestamp at the start of the campaign
		 */
		this.startTime = startTime;
		/**
		 * Initialize array of timesteps
		 */
		this.timesteps = [];
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
	 * Initialize a new campaign
	 */
	async initialize() {
		const bounds = this.seedLatLng.toBounds(extentSize);
		await this.createExtent(bounds);

		await this.startFire(this.seedLatLng);

		this.timesteps.push(
			new TimeStep(
				this.extents.map((extent) => extent.burnMatrix.clone()),
				this
			)
		);

		this.propagateTimestep();
	}

	/**
	 * Starts a fire at the latlng.  Creates a new extent if necessary,
	 * or grows an existing one if necessary
	 * @param latLng | The latlng location to start the fire
	 */
	async startFire(latLng: L.LatLng) {
		const point = L.CRS.EPSG3857.latLngToPoint(latLng, scale).round();
		const bounds = this.seedLatLng.toBounds(extentSize);

		let extent = this.extents.find((extent) =>
			extent.latLngBounds.contains(latLng)
		);

		if (!extent) {
			extent = await this.createExtent(bounds);
			this.extents.push(extent);
		}

		extent.burnMatrix.setBurnStatus([point.x, point.y], 1);

		Logger.log(
			`${Logger.emojis.fire} Fire started at [${latLng.lat}, ${latLng.lng}]`
		);
	}

	/**
	 * Propagates the Campaign to the next timestep.  Contains all central algorithm logic
	 * to determine wildfire spread and any associated FireStarterEvents
	 */
	propagateTimestep() {
		this.extents.forEach((extent) => {
			extent.burnMatrix.burning.forEach((burningCell) => {
				extent.burnMatrix.neighbors(burningCell).forEach((neightbor) => {
					console.log(neightbor);
				});
			});
		});
	}
}

export default Campaign;
