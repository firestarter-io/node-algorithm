/**
 * Firestarter.io
 *
 * Specialized extention of Matrix class which adds methods and variables
 * specific to burn code
 */

import { Matrix } from 'mathjs';
import { math } from '@utils/math';
import { BurnStatuses } from 'typings/firestarter';
import Extent from './Extent';

/**
 * Cell is a number tuple representing the [x. y] position of a cell in a matrix
 */
type Cell = [number, number];

class BurnMatrix {
	/**
	 * The mathjs matrix at the core of the BurnMatrix instance
	 */
	matrix: Matrix;
	/**
	 * The Extent instance that the BurnMatrix instance belongs to
	 */
	extent: Extent;
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
	constructor(width: number, height: number, extent: Extent) {
		this.matrix = math.zeros(width, height, 'sparse') as Matrix;
		this.extent = extent;
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

	/**
	 * Direct access method to set the matrix value at a certain position
	 * @param position | [x, y] position in array
	 * @param value | Value to set at that position
	 */
	set(position: Cell, value: any): void {
		this.matrix.set(position, value);
	}

	/**
	 * Direct access method to get the value in the matrix at an [x, y] position
	 * @param position | [x, y] position in array
	 */
	get(position: Cell) {
		this.matrix.get(position);
	}

	/**
	 * Returns the positions of the 8 neighbors of a cell in the burn matrix
	 * @param position | [x, y] position of cell in matrix
	 */
	neighbors(position: Cell): Cell[] {
		const [x, y] = position;
		let neighbors = [];
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (!(i === 0 && j === 0)) {
					neighbors.push([x + i, y + j]);
				}
			}
		}
		return neighbors;
	}
}

export default BurnMatrix;
