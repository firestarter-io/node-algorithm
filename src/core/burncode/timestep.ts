/**
 * Firestarter.io
 *
 * TimeStep class
 */

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
	timestamp: Date;

	/**
	 * A TimeStep is a snapshot of the state of a Campaign at a given time.
	 * @param campaign | The Campaign that the timestep belongs to
	 */
	constructor(campaign: Campaign) {
		this.campaign = campaign;
	}
}

export default TimeStep;
