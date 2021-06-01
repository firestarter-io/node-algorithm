/**
 * Firestarter.io
 *
 * TimeStep class
 */

import { Matrix } from 'mathjs';
import { FireStarterEvent } from 'typings/firestarter';
import { timestepSize } from '@config';
import { Campaign } from './Campaign';
import Cell, { NeighborCell } from './Cell';

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
	 * Cells that have been calculated in this timestep
	 */
	touchedCells: Set<string> = new Set<string>();
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
	 * Calculates and applies burn statuses for Cells in this Timestep
	 */
	burn() {
		this.campaign.extents.forEach((extent) => {
			extent.burnMatrix.burning.forEach((burningCell) => {
				//
				const touched = this.cellTouched(burningCell);
				burningCell.calculateBurnStatus(touched);

				burningCell.neighbors().forEach((neighbor) => {
					//
					const touched = this.cellTouched(neighbor);
					neighbor.calculateBurnStatus(touched);
					//
				});
			});
		});

		if (this.index < 10) {
			this.next();
		}
	}

	/**
	 * Propagates the Campaign to the next timestep.
	 */
	next() {
		new TimeStep(
			this.campaign.extents.map((extent) => extent.burnMatrix.clone()),
			this.campaign
		);
	}
}

export default TimeStep;
