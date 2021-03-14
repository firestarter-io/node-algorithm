/**
 * Firestarter.io
 *
 * TimeStep class
 */

import { Matrix } from 'mathjs';
import { FireStarterEvent } from 'typings/firestarter';
import { timestepSize } from '@config';
import { Campaign } from './Campaign';

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
	 * The timestamp of the time step
	 */
	timestamp: number;
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
	}
}

export default TimeStep;
