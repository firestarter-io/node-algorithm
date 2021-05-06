/**
 * Firestarter.io
 *
 * Cell class to represent a single pixel in an Extent
 */

import * as L from 'leaflet';
import { tileSize } from '@config';
import { getTopography } from '@core/getData/getTopography';
import BurnMatrix from './BurnMatrix';
import Extent from './Extent';
import { CellPosition } from 'typings/firestarter';

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
				neighbors.push(
					new Cell(this.matrixPositionToLayerPoint([x + i, y + j]), this.extent)
				);
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

	/**
	 * Returns data for all data types for the Cell
	 */
	async getData() {
		const { slope, aspect } = getTopography(this.layerPoint);
		// console.log({ slope, aspect });
	}

	/**
	 * If a Cell is too close to the edge of its Extent, it will tigger the Extent
	 * to expand in the direction of the side it is closest to.  A Cell is determined
	 * to be too close if it is within @param buffer tiles of the edge of its extent
	 * @param buffer | Number of tiles to use as buffer
	 */
	checkDistanceToEdge(buffer: number = 1) {
		const [x, y] = this.position;

		// Get distances from cell to 4 edges of extent
		const dLeft = x;
		const dRight = this.extent.width - x;
		const dTop = y;
		const dBottom = this.extent.height - y;

		if (dLeft < tileSize * buffer) {
			this.extent.expandLeft();
		}

		if (dRight < tileSize * buffer) {
			this.extent.expandRight();
		}

		if (dTop < tileSize * buffer) {
			this.extent.expandUp();
		}

		if (dBottom < tileSize * buffer) {
			this.extent.expandDown();
		}
	}
}

export default Cell;
