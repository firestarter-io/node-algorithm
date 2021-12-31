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
 * Specialized extention of Matrix class which adds methods and variables
 * specific to burn code
 */

import { Matrix } from 'mathjs';
import { math } from '@utils/math';
import { CellPosition } from 'typings/firestarter';
import Extent from './Extent';
import Cell, { NeighborCell } from './Cell';

export const BURN_PERIMETER = 1001;

/**
 * Creates a specialized matrix based on a MathJS matrix capable of setting its own cells
 * to burn status values, as well as quickly indexing what cells are currently in a given
 * burn status.
 *
 * ***&#128211; &nbsp; See more in the [BurnMatrix documentation](https://firestarter-io.github.io/node-algorithm/algorithm/burnmatrix/)***
 */
class BurnMatrix {
	/**
	 * The mathjs matrix at the core of the BurnMatrix instance
	 */
	matrix: Matrix;
	/**
	 * The Extent instance that the BurnMatrix instance belongs to
	 */
	_extent: Extent;
	/**
	 * Cells that are currently burning
	 */
	burningCells: Map<string, Cell> = new Map<string, Cell>();
	/**
	 * Cells are on the perimeter of the burning area
	 */
	burningPerimeterCells: Map<string, Cell> = new Map<string, Cell>();
	/**
	 * Cells are were once on the perimeter of the burning area
	 */
	exBurningPerimeterCells: Map<string, Cell> = new Map<string, Cell>();
	/**
	 * Cells that are burned out
	 */
	burnedOutCells: Map<string, Cell> = new Map<string, Cell>();
	/**
	 * Cells where fire has been supressed
	 */
	supressedCells: Map<string, Cell> = new Map<string, Cell>();
	/**
	 * Array containing all tracked cell arrays
	 */
	trackedCells: Map<string, Cell>[] = [
		this.burningCells,
		this.supressedCells,
		this.burnedOutCells,
	];

	/**
	 * Creates a specialized matrix based on a MathJS matrix capable of setting its own cells
	 * to burn status values, as well as quickly indexing what cells are currently in a given
	 * burn status.
	 * @param size | The x and y dimensions of the burn matrix
	 */
	constructor(width: number, height: number, extent: Extent) {
		this.matrix = math.zeros(height, width, 'sparse') as Matrix;
		this._extent = extent;
	}

	/**
	 * Sets the burn status of a cell in the matrix and maintains
	 * quickly searchable lists of cells currently in each BurnStatuses category
	 * @param position | The position of the cell in the matrix
	 * @param burnStatus | The burn status to set the cell to
	 */
	setBurnStatus(cell: Cell | NeighborCell, burnStatus: number) {
		this.set(cell.position, burnStatus);

		if (cell instanceof NeighborCell) {
			cell = cell.toCell();
		}

		switch (true) {
			// BURNING
			case burnStatus >= 1 && burnStatus !== BURN_PERIMETER:
				this.burningCells.set(cell.id, cell);
				if (this.burningPerimeterCells.has(cell.id)) {
					this.burningPerimeterCells.delete(cell.id);
					this.exBurningPerimeterCells.set(cell.id, cell);
				}
				break;
			case burnStatus === BURN_PERIMETER:
				this.burningPerimeterCells.set(cell.id, cell);
				break;
			// BURNED_OUT
			case burnStatus === -1:
				this.burnedOutCells.set(cell.id, cell);
				this.burningCells.delete(cell.id);
				break;
			// SUPRESSED
			case burnStatus === -2:
				this.burnedOutCells.set(cell.id, cell);
				this.burningCells.delete(cell.id);
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
		this.matrix.set([...position].reverse(), value);
	}

	/**
	 * Direct access method to get the value in the matrix at an [x, y] position
	 * @param position | [x, y] position in array
	 */
	get(position: CellPosition): number {
		return this.matrix.get([...position].reverse());
	}

	/**
	 * Direct method to resize the burn matrix
	 * @param width | Width of resultant matrix in pixels
	 * @param height | Height of resultant matrix in pixels
	 */
	resize(width: number, height: number) {
		const newmatrix = this.matrix.resize([height, width]);
		this.matrix = math.sparse(newmatrix);
	}

	/**
	 * Returns cloned copy of underlying matrix
	 */
	clone() {
		return this.matrix.clone();
	}

	/**
	 * Takes a snapshot of the BurnMatrix at a given point in time, creates serializable object
	 * containing information about the BurnMatrix and its Extent
	 */
	toJSON() {
		const { _campaign, burnMatrix, ...serializableExtent } = this._extent;

		return {
			burnMatrix: this.clone().toJSON(),
			...serializableExtent,
		};
	}
}

export default BurnMatrix;
