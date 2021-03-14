/**
 * Firestarter.io
 *
 * Cell class to represent a single pixel in an Extent
 */

import * as L from 'leaflet';
import { CellPosition } from 'typings/firestarter';
import BurnMatrix from './BurnMatrix';
import Extent from './Extent';

class Cell {
	/**
	 * The layerpoint of the Cell's position
	 */
	layerPoint: L.Point;
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
	 * @param layerPoint | layer point of the Cell's position
	 * @param extent | The Extent that the Cell belongs to
	 */
	constructor(layerPoint: L.Point, extent: Extent) {
		this.layerPoint = layerPoint;
		this.extent = extent;
		this.burnMatrix = extent.burnMatrix;
		this.position = this.layerPointToMatrixPosition(layerPoint);
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
					neighbors.push(
						new Cell(
							this.matrixPositionToLayerPoint([x + i, y + j]),
							this.extent
						)
					);
				}
			}
		}
		return neighbors;
	}

	/**
	 * Takes layer point of Cell and returns its position in the matrix
	 * @param layerPoint | L.Point
	 */
	layerPointToMatrixPosition(layerPoint: L.Point): CellPosition {
		return [
			layerPoint.x - this.extent.origin.x,
			layerPoint.y - this.extent.origin.y,
		];
	}

	/**
	 * Takes in cell position in matrix and returns its leaflet layerPoint
	 * @param position | [x, y] position of Cell in matrix
	 */
	matrixPositionToLayerPoint(position: CellPosition) {
		return new L.Point(
			position[0] + this.extent.origin.x,
			position[1] + this.extent.origin.y
		);
	}

	/**
	 * Sets the burn status of the cell
	 * @param burnStatus | Number representing a burn status,
	 */
	setBurnStatus(burnStatus: number) {
		this.burnMatrix.setBurnStatus(this, burnStatus);
	}

	/**
	 * Returns the burn status for the cell
	 */
	getBurnStatus() {
		return this.burnMatrix.get(this.position);
	}

	/**
	 * Calculates the burn status of the cell and sets it
	 */
	calculateBurnStatus() {
		const burnStatus = this.getBurnStatus();
	}
}

export default Cell;
