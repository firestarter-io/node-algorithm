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

import { Matrix } from 'mathjs';
import { FireStarterEvent } from 'typings/firestarter';
import { timestepSize } from '@config';
import { Campaign } from './Campaign';
import Cell, { NeighborCell } from './Cell';
import { WeatherForecast } from '@core/getdata/weather';
import { EventQueueItem } from './PriorityQueue';

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
	 * Ids of Cells that have been calculated in this timestep
	 */
	touchedCells: Set<string> = new Set<string>();
	/**
	 * Array of events that occurred in that timestep, if any
	 */
	events: FireStarterEvent[];
	/**
	 * Serializable JSON copy of the timestep
	 */
	snapshot;

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
		this._campaign = campaign;
		this.event = campaign.eventQueue.next();
		/** If there is a next event in the eventQueue (we are not at the end of the queue) */
		if (this.event) {
			this.index = this._campaign.timesteps.length;
			this.timestamp = this._campaign.startTime + this.index * timestepSize;
			this.time = new Date(this.timestamp).toLocaleString();
			this.weather = this.derivedWeather;
			this._campaign.timesteps.push(this);
			this.snapshot = this.toJSON();
			this.burn();
		}
	}

	/**
	 * Checks whether or not a Cell's burn status has already been calculated in this timestep.
	 * If not, it adds it to the touchedCells array
	 * @param cell Cell or NeighborCell
	 * @returns Boolean - whether or not cell has already been worked on in this timestep
	 */
	cellTouched(cell: Cell | NeighborCell) {
		const touched = this.touchedCells.has(cell.id);
		if (!touched) {
			this.touchedCells.add(cell.id);
		}
		return touched;
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
			 * Set the burn status to 1
			 */
			cellToBurn.setBurnStatus(1);

			/**
			 * Object to organize neighbor cells to be added to queue by timestamp at which they'll be added
			 */
			const eventsToAddToQueue: {
				[key: number]: {
					[key: string]: Cell;
				};
			} = {};

			/**
			 * Determine if/when neighbor cells will be set to burning:
			 */
			cellToBurn.neighbors.forEach((neighbor) => {
				const touched = this.cellTouched(neighbor);

				/**
				 * If this Cell has not already been worked on in this timestep:
				 */
				if (!touched) {
					/**
					 * The amount of time from the current TimeStep until this NeighborCell will ignite, in ms
					 */
					const timeToIgnite =
						neighbor.distanceCoefficient *
						(cellToBurn._extent.averageDistance / neighbor.rateOfSpread) *
						60 *
						60 *
						1000;

					/**
					 * The timestamp at which the cell will ignite, in ms
					 */
					const timestampOfIgnition = this.timestamp + timeToIgnite;

					/**
					 * An event already added at a specific timestamp (from a previously burned neighbor)
					 */
					const existingEventToAdd = eventsToAddToQueue[timestampOfIgnition];

					/**
					 * Populate events to add to queue with any events for this timestamp
					 */
					eventsToAddToQueue[timestampOfIgnition] = {
						/**
						 * IF there were previous Cells in this loop for this timestamp, spread them in
						 */
						...(existingEventToAdd ?? {}),
						/**
						 * Add the new neighbor to this event
						 */
						[neighbor.id]: neighbor.toCell(),
					};
				}
			});

			/**
			 * Transform object to Map for easier iteration
			 */
			const eventsAsMap = new Map(Object.entries(eventsToAddToQueue));

			/**
			 * For each timestamp where cells are to be burned, add an item to the eventQueue
			 */
			eventsAsMap.forEach((value, key) => {
				this._campaign.eventQueue.enqueue({
					time: Number(key),
					origin: this.timestamp,
					setToBurning: value,
				});
			});
		});

		if (this.index < 300) {
			this.next();
		}
	}

	/**
	 * Propagates the Campaign to the next timestep.
	 */
	next() {
		new TimeStep(this._campaign);
	}

	/**
	 * Converts the Timestep class instance to a serializable JSON-friendly object
	 * Removes all circular references and readies Timestep object to be sent to front end
	 * or database
	 */
	toJSON() {
		const { _campaign, event, touchedCells, ...serializedTimestep } = this;
		return {
			...serializedTimestep,
			extents: this._campaign.extents.map((extent) =>
				extent.burnMatrix.toJSON()
			),
		};
	}
}

export default TimeStep;
