/**
 * Firestarter.io
 *
 * TimeStep class
 */

import { Matrix } from 'mathjs';
import { FireStarterEvent } from 'typings/firestarter';
import { timestepSize } from '@config';
import { Campaign } from './Campaign';
import Cell from './Cell';

class TimeStep {
	/**
	 * The Campaign that the timestep belongs to
	 */
	campaign: Campaign;
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
	 * Array of burn matrices, cloned from the Campaigns extent
	 */
	burnMatrices: Matrix[];
	/**
	 * Array of events that occurred in that timestep, if any
	 */
	events: FireStarterEvent[];

	/**
	 * A TimeStep is a snapshot of the state of a Campaign at a given time.
	 * Contains unique information for a given timestep, like the state of the burnMatrices,
	 * their derived polygons, any events for the timestep, etc.
	 * @param campaign | The Campaign that the timestep belongs to
	 */
	constructor(matrixSnapshots: Matrix[], campaign: Campaign) {
		this.burnMatrices = matrixSnapshots;
		this.campaign = campaign;
		this.index = this.campaign.timesteps.length;
		this.timestamp = this.campaign.startTime + this.index * timestepSize;
		this.time = new Date(this.timestamp).toLocaleString();
		this.campaign.timesteps.push(this);
		this.burn();
	}

	/**
	 * Calculates and applies burn statuses for Cells in this Timestep
	 */
	burn() {
		this.campaign.extents.forEach((extent) => {
			/**
			 * Keep track of which cells have already been worked on
			 */
			const done: Cell[] = [];
			extent.burnMatrix.burning.forEach((burningCell) => {
				burningCell.calculateBurnStatus();
				burningCell.neighbors().forEach((neightbor) => {
					neightbor.calculateBurnStatus();
					neightbor.data;
				});
			});
		});

		if (this.index < 10) {
			this.next();
		}
	}

	/**
	 * Moves the Campaign forward to the next Timestep
	 * @param prevTimestep The Timestep prior to the one about to be created
	 */
	next() {
		new TimeStep(
			this.campaign.extents.map((extent) => extent.burnMatrix.clone()),
			this.campaign
		);
	}
}

export default TimeStep;
