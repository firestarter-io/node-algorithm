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
 * TimeStep class
 */

import * as L from 'leaflet';
import { scale } from '@config';
import { FireStarterEvent } from 'typings/firestarter';
import { Campaign } from './Campaign';
import { EventQueueItem } from './PriorityQueue';
import { WeatherForecast } from '@core/getdata/weather';
import { roundTime } from '@core/utils/time';
import { BURN_PERIMETER } from './BurnMatrix';

class TimeStep {
	/**
	 * The Campaign that the timestep belongs to
	 */
	_campaign: Campaign;
	/**
	 * The event in the event queue that spawned the timestep
	 */
	event: EventQueueItem;
	/**
	 * Index of the timestep in a campaign's timestep array
	 */
	index: number;
	/**
	 * The unix timestamp of the time step
	 */
	timestamp: number;
	/**
	 * The human readable time of the timestep
	 */
	time: string;
	/**
	 * Weather forecast for the hour of the current TimeStep
	 */
	weather: WeatherForecast;
	/**
	 * Array of events that occurred in that timestep, if any
	 */
	events: FireStarterEvent[];
	/**
	 * Serializable JSON copy of the timestep
	 */
	snapshot: ReturnType<TimeStep['toJSON']>;

	/**
	 * A TimeStep produces a snapshot of the state of a Campaign at a given time.
	 * The calculations that determine how a fire will progress from one moment to another
	 * are contained in the Timestep's methods.
	 *
	 * Returns unique information for a given timestep, like the state of the burnMatrices,
	 * their derived polygons, any events for the timestep, etc.
	 * @param campaign | The Campaign that the timestep belongs to
	 */
	constructor(campaign: Campaign) {
		var start = process.hrtime();
		this._campaign = campaign;
		this.event = campaign.eventQueue.next();
		/** If there is a next event in the eventQueue (we are not at the end of the queue) */
		if (this.event) {
			this.index = this._campaign.timesteps.length;
			this.timestamp = this.event.time;
			this.time = new Date(this.timestamp).toLocaleString();
			this.weather = this.derivedWeather;
			this.burn();
			this.snapshot = this.toJSON();
			this._campaign.timesteps.push(this);
			var stop = process.hrtime(start);

			// DEV ▼
			if (this.index % 100 === 0) {
				console.log(`\nCalculated Timestep ${this.index}`);
				console.log(`Time to execute: ${Math.floor(stop[1] / 1000)}μs`);
			}
			// DEV ▲
		}
	}

	/**
	 * Function to get weather from forecast, either direct weather forecast or derived from
	 * similar dates / times
	 */
	get derivedWeather(): WeatherForecast {
		/**
		 * The exact weather for the hour of the timestep as retrieved from VisualCrossing, if it exists
		 */
		const realHourlyWeather = this._campaign.weather[this.timestamp / 1000];

		// DEV ▼
		/**
		 * Weather spoofed duplicated from previous day(s) available from the api call
		 */
		const duplicatedHourlyWeather: WeatherForecast = Object.values(
			this._campaign.weather
		).find((weatherHour: WeatherForecast) => {
			const dateOfWeatherHour = new Date(weatherHour.datetimeEpoch * 1000);
			const dateOfTimestep = new Date(this.timestamp);
			return dateOfWeatherHour.getHours() === dateOfTimestep.getHours();
		});
		// DEV ▲

		return realHourlyWeather ?? duplicatedHourlyWeather;
	}

	/**
	 * Calculates and applies burn statuses for Cells in this Timestep
	 */
	burn() {
		/**
		 * For each cell in the event queue that is slated to be set to burning:
		 */
		new Map(Object.entries(this.event.setToBurning)).forEach((cellToBurn) => {
			/**
			 * If cell is ignitable, set it to burning
			 */
			if (cellToBurn.isIgnitable) {
				cellToBurn.setBurnStatus(1);
			}

			/**
			 * Determine if/when neighbor cells will be set to burning:
			 */
			cellToBurn.neighbors.forEach((neighbor) => {
				/**
				 * If the neighbor is currently burnable
				 */
				if (neighbor.isIgnitable) {
					/**
					 * The amount of time from the current TimeStep until this NeighborCell will ignite, in ms
					 */
					const timeToIgnite = // TODO: check this math!
						neighbor.distanceCoefficient *
						(cellToBurn._extent.averageDistance / neighbor.rateOfSpread) *
						60 *
						60 *
						1000;

					/**
					 * The timestamp at which the cell will ignite, in ms
					 */
					const timestampOfIgnition = this.timestamp + timeToIgnite;

					this._campaign.eventQueue.enqueue({
						time: roundTime.bySecond(Math.floor(Number(timestampOfIgnition))),
						origin: this.timestamp,
						setToBurning: { [neighbor.id]: neighbor.toCell() },
					});
				}
			});

			// cellToBurn.checkDistanceToEdge().then(() => {});
		});

		/**
		 * Iterate over all burning cells and detect perimeter
		 */
		this._campaign.extents.forEach((extent) => {
			const potentialPerimeterCells = new Map();
			for (const [cellId, cell] of extent.burnMatrix.burningCells) {
				if (!extent.burnMatrix.exBurningPerimeterCells.has(cellId)) {
					potentialPerimeterCells.set(cellId, cell);
				}
			}

			potentialPerimeterCells.forEach((cell) => {
				const perimeterCell = cell.neighbors.some(
					(neighbor) => neighbor.burnStatus === 0
				);
				if (perimeterCell) {
					cell.setBurnStatus(BURN_PERIMETER);
				} else {
					cell.setBurnStatus(1);
				}
			});

			// Better to do this? :
			// extent.burnMatrix.burningCells.forEach(cell => {
			// 	if (!cell._burnMatrix.exBurningPerimeterCells.has(cell.id)) {
			// 		const perimeterCell = cell.neighbors.some(
			// 			(neighbor) => neighbor.burnStatus === 0
			// 		);
			// 		if (perimeterCell) {
			// 			cell.setBurnStatus(BURN_PERIMETER);
			// 		} else {
			// 			cell.setBurnStatus(1);
			// 		}
			// 	}
			// })
		});
	}

	/**
	 * Converts the Timestep class instance to a serializable JSON-friendly object
	 * Removes all circular references and readies Timestep object to be sent to front end
	 * or database
	 */
	toJSON() {
		const { _campaign, event, ...serializedTimestep } = this;
		return {
			...serializedTimestep,
			extents: this._campaign.extents.map((extent) => ({
				id: extent.id,
				...extent.burnMatrix.toJSON(),
				perimeters: {
					burning: [...extent.burnMatrix.burningPerimeterCells].map(
						([id, cell]) => L.CRS.EPSG3857.pointToLatLng(cell.layerPoint, scale)
					),
				},
			})),
		};
	}
}

export default TimeStep;
