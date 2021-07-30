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
	burning: Map<string, Cell>;
	/**
	 * Cells that are burned out
	 */
	burnedOut: Map<string, Cell>;
	/**
	 * Cells where fire has been supressed
	 */
	supressed: Map<string, Cell>;
	/**
	 * Array containing all tracked cell arrays
	 */
	trackedCells: Map<string, Cell>[];

	/**
	 * Creates a specialized matrix based on a MathJS matrix capable of setting its own cells
	 * to burn status values, as well as quickly indexing what cells are currently in a given
	 * burn status.
	 * @param size | The x and y dimensions of the burn matrix
	 */
	constructor(width: number, height: number, extent: Extent) {
		this.matrix = math.zeros(height, width, 'sparse') as Matrix;
		this._extent = extent;
		this.burning = new Map();
		this.burnedOut = new Map();
		this.supressed = new Map();
		this.trackedCells = [this.burning, this.supressed, this.burnedOut];
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
			case burnStatus >= 1:
				this.burning.set(cell.id, cell);
				break;
			// BURNED_OUT
			case burnStatus === -1:
				this.burnedOut.set(cell.id, cell);
				this.burning.delete(cell.id);
				break;
			// SUPRESSED
			case burnStatus === -2:
				this.burnedOut.set(cell.id, cell);
				this.burning.delete(cell.id);
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
	takeSnapshot() {
		const { _campaign, burnMatrix, ...serializableExtent } = this._extent;

		return {
			burnMatrix: this.clone(),
			...serializableExtent,
		};
	}
}

export default BurnMatrix;
