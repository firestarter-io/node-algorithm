/**
 * Firestarter.io
 *
 * Specialized extention of Matrix class which adds methods and variables
 * specific to burn code
 */

import { Matrix } from 'mathjs';
import { math } from '@utils/math';
import { CellPosition } from 'typings/firestarter';
import Extent from './Extent';
import Cell from './Cell';

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
	setBurnStatus(cell: Cell, burnStatus: number) {
		this.set(cell.position, burnStatus);
		const ind = this.burning.indexOf(cell);

		switch (true) {
			// BURNING
			case burnStatus >= 1:
				this.burning.push(cell);
				break;
			// BURNED_OUT
			case burnStatus === -1:
				this.burnedOut.push(cell);
				this.burning.splice(ind, 1);
				break;
			// SUPRESSED
			case burnStatus === -2:
				this.burnedOut.push(cell);
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
	set(position: CellPosition, value: any): void {
		this.matrix.set(position, value);
	}

	/**
	 * Direct access method to get the value in the matrix at an [x, y] position
	 * @param position | [x, y] position in array
	 */
	get(position: CellPosition) {
		this.matrix.get(position);
	}

	/**
	 * Returns cloned copy of underlying matrix
	 */
	clone() {
		return this.matrix.clone();
	}
}

export default BurnMatrix;
