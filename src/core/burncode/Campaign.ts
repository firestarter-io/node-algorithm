/*
 * Firestarter.io
 *
 * Copyright (C) 2022 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

/**
 * Campaign class creates a new campaign object with all of
 * its relevant properties and methods
 */

import * as L from 'leaflet';
import { v4 as uuid } from 'uuid';
import * as data from '~data';
import { scale, extentSize, PROFILER_TIMESTEPS } from '~config';
import Extent from './Extent';
import TimeStep from './Timestep';
import logger, { emojis } from '~core/utils/Logger';
import Cell from './Cell';
import { roundTime } from '~core/utils/time';
import {
	fetchWeatherRange,
	flattenWeatherHours,
	WeatherByTheHour,
} from '~core/getdata/weather';
import PriorityQueue from './PriorityQueue';
import { resample } from '~core/utils/arrays';

/**
 * Campaign class creates a new campaign object, which is the central unit of firestarter.
 * A campaign manages its own configuration, user inputs, map extents and their associated data,
 * timesteps, and writing campaign data to the database
 *
 * ***&#128211; &nbsp; See more in the [Campaign documentation](https://firestarter-io.github.io/node-algorithm/components/campaign/)***
 */
export class Campaign {
	/**
	 * Unique id of the campaign
	 */
	id: string;
	/**
	 * Campaign must be constructed from a first seed latlng
	 */
	seedLatLng: L.LatLng;
	/**
	 * Array of extents in Campaign
	 */
	extents: Extent[];
	/**
	 * Timestamp at the start of the campaign
	 */
	startTime: number;
	/**
	 * Array of TimeSteps in the Campaign
	 */
	timesteps: TimeStep[];
	/**
	 * Weather forecast by the hour for the Campaign
	 */
	weather: WeatherByTheHour = {};
	/**
	 * The event queue for the campaign
	 */
	eventQueue: PriorityQueue;

	/**
	 * Campaign class creates a new campaign object, which is the central unit of firestarter.
	 * A campaign manages its own configuration, user inputs, map extents and their associated data,
	 * timesteps, and writing campaign data to the database
	 * @param latlng | An initial latlng representing the starting point of the first first
	 */
	constructor(latlng: L.LatLng, startTime: number = roundTime.byHour()) {
		this.seedLatLng = latlng;
		this.extents = [];
		this.startTime = roundTime.byHour(startTime);
		this.timesteps = [];
		this.id = uuid();
		this.eventQueue = new PriorityQueue();
		data.campaigns[this.id] = this;
	}

	/**
	 * Creates a new extent from a LatLngBounds. Automatically resizes the bounds to nearest
	 * surroundings bounds of tiles contained within the LatLngBounds, and fetches all data
	 * for the extent
	 * @param bounds | Bounds to create a new extent from
	 */
	async createExtent(bounds: L.LatLngBounds) {
		const extent = new Extent(bounds, this);
		this.extents.push(extent);
		await extent.fetchData();
		return extent;
	}

	/**
	 * Function to fetch weather for the campaign, for a given latlng and time period
	 * Currently uses weather for a singular location applied across the whole campaign
	 *
	 * @param latlng | LatLng location of forecast / historyical date
	 * @param startTime | Unix timestamp of start time, in seconds, not miliseconds
	 * @param endTime | Unix timestamp of end time, in seconds, not miliseconds
	 */
	async getWeather(latlng: L.LatLng, startTime: number, endTime: number) {
		logger.info(`${emojis.fetch} Fetching weather . . .`);
		try {
			const rawForecast = await fetchWeatherRange(latlng, startTime, endTime);
			const newHours = flattenWeatherHours(rawForecast);
			this.weather = { ...this.weather, ...newHours };
			logger.info(`${emojis.successCheck} Weather ready`);
		} catch (e) {
			logger.error(`${emojis.errorX} Weather failed to fetch`);
		}
	}

	/**
	 * Initialize a new campaign
	 */
	async initialize() {
		logger.log(
			'header',
			'------------------- Initializing campaign -------------------'
		);

		const bounds = this.seedLatLng.toBounds(extentSize);
		await this.createExtent(bounds);
		await this.getWeather(
			this.seedLatLng,
			this.startTime,
			this.startTime + 1.21e9
		);
		logger.log(
			'header',
			'---------------------- Campaign created ---------------------'
		);

		const firstBurningCell = await this.startFire(this.seedLatLng);

		this.start(firstBurningCell);
	}

	/**
	 * Starts a fire at the latlng.  Creates a new extent if necessary,
	 * or grows an existing one if necessary
	 * @param latLng | The latlng location to start the fire
	 */
	async startFire(latLng: L.LatLng) {
		/**
		 * Transform a latlng to a layer point, extrapolate to bounds, and create an extent
		 */
		const point = L.CRS.EPSG3857.latLngToPoint(latLng, scale).round();
		const bounds = this.seedLatLng.toBounds(extentSize);

		let extent = this.extents.find(extent =>
			extent.latLngBounds.contains(latLng)
		);

		if (!extent) {
			extent = await this.createExtent(bounds);
			this.extents.push(extent);
		}

		const burningCell = new Cell(point, extent);

		burningCell.setBurnStatus(1);

		logger.info(
			`${emojis.fire} Fire started at [${latLng.lat}, ${latLng.lng}]`
		);

		return burningCell;
	}

	/**
	 * Begin the Campaign by creating the first event in the eventQueue
	 */
	start(firstBurningCell: Cell) {
		this.eventQueue.enqueue({
			time: this.startTime,
			origin: this.startTime,
			setToBurning: {
				[firstBurningCell.id]: firstBurningCell,
			},
		});

		this.continue();
	}

	/**
	 * Calculates timesteps in succession, propagating the simulation forward through time
	 */
	continue() {
		while (this.timesteps.length < (PROFILER_TIMESTEPS ?? 3000)) {
			new TimeStep(this);
		}
	}

	/**
	 * Converts the Campaign class instance to a serializable JSON-friendly object
	 * Removes all circular references and readies campaign object to be sent to front end
	 * or database
	 */
	toJSON() {
		const simplifiedCampaign = {
			id: this.id,
			startTime: this.startTime,
			extents: this.extents.map(extent => ({
				bounds: extent.latLngBounds,
				averageDistance: extent.averageDistance,
			})),
			// timesteps: clone.timesteps.map((timestep) => timestep.snapshot),
			timesteps: resample(
				this.timesteps.map(timestep => timestep.snapshot),
				'timestamp',
				10 * 60 * 1000,
				(timestep, resampledTime) => {
					timestep.timestamp = resampledTime;
					timestep.time = new Date(resampledTime).toLocaleString();
					return timestep;
				}
			),
		};

		return simplifiedCampaign;
	}
}

export default Campaign;
