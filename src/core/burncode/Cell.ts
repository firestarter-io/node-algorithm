/**
 * Firestarter.io
 *
 * Cell class to represent a single pixel in an Extent
 */

import { CellPosition } from 'typings/firestarter';
import BurnMatrix from './BurnMatrix';
import Extent from './Extent';

class Cell {
	/**
	 * The position of the Cell in its matrix
	 */
	position: CellPosition;
	/**
	 * The BurnMatrix that the Cell belongs to
	 */
	burnMatrix: BurnMatrix;
	/**
	 * The Extent that the Cell belongs to
	 */
	extent: Extent;

	/**
	 * A Cell represents a single pixel in a burn matrix
	 * @param position | [x, y] position of Cell in its matrix
	 * @param burnMatrix | he BurnMatrix that the Cell belongs to
	 * @param extent | The Extent that the Cell belongs to
	 */
	constructor(position: CellPosition, extent: Extent) {
		this.position = position;
		this.extent = extent;
		this.burnMatrix = extent.burnMatrix;
	}

	/**
	 * Returns the positions of the 8 neighbors of a cell in the burn matrix
	 * @param position | [x, y] position of cell in matrix
	 */
	neighbors(): Cell[] {
		const [x, y] = this.position;
		let neighbors = [];
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (!(i === 0 && j === 0)) {
					neighbors.push(new Cell([x + i, y + j], this.extent));
				}
			}
		}
		return neighbors;
	}

	setBurnStatus(burnStatus: number) {
		this.burnMatrix.setBurnStatus(this, burnStatus);
	}
}

export default Cell;
