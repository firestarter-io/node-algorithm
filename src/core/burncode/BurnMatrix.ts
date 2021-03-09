/**
 * Firestarter.io
 *
 * Specialized extention of Matrix class which adds methods and variables
 * specific to burn code
 */

import { Matrix } from 'mathjs';
import { math } from '@utils/math';
import { BurnStatuses } from 'typings/firestarter';

type Cell = [number, number];

class BurnMatrix {
	/**
	 * The mathjs matrix at the core of the BurnMatrix instance
	 */
	matrix: Matrix;
	/**
	 * Cells that are currently burning
	 */
	burning: Cell[];
	/**
	 * Cells that are burned out
	 */
	burnedOut: Cell[];
	/**
	 * Cells where fire has been supressed
	 */
	supressed: Cell[];

	/**
	 * Creates a specialized matrix based on a MathJS matrix capable of setting its own cells
	 * to burn status values, as well as quickly indexing what cells are currently in a given
	 * burn status.
	 * @param size | The x and y dimensions of the burn matrix
	 */
	constructor(width: number, height: number) {
		this.matrix = math.zeros(width, height, 'sparse') as Matrix;
		this.burning = [];
		this.burnedOut = [];
		this.supressed = [];
	}

	/**
	 * Sets the burn status of a cell in the matrix and maintains
	 * @param position | The position of the cell in the matrix
	 * @param burnStatus | The burn status to set the cell to
	 */
	setBurnStatus(position: Cell, burnStatus: BurnStatuses) {
		this.matrix.set(position, burnStatus);
		switch (burnStatus) {
			case BurnStatuses.BURNING:
				this.burning.push(position);
				break;
			case BurnStatuses.BURNED_OUT:
				this.burnedOut.push(position);
				const ind = this.burning.indexOf(position);
				this.burning.splice(ind, 1);
				break;
			default:
				break;
		}
	}
}

// @ts-ignore
global.BurnMatrix = BurnMatrix;

export default BurnMatrix;
