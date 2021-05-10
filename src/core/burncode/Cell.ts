/**
 * Firestarter.io
 *
 * Cell class to represent a single pixel in an Extent
 */

import * as L from 'leaflet';
import { tileSize } from '@config';
import { getElevation, getTopography } from '@core/getData/getTopography';
import BurnMatrix from './BurnMatrix';
import Extent from './Extent';
import { CellPosition } from 'typings/firestarter';
import { ROOT2 } from '@core/utils/math';

export enum Directions {
	N = 'N',
	S = 'S',
	E = 'E',
	W = 'W',
	NE = 'NE',
	NW = 'NW',
	SE = 'SE',
	SW = 'SW',
}
export type Bearings = 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315;
export type DistanceCoefficients = 1 | typeof ROOT2;

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

	static neighborsMap = {
		'[-1,-1]': Directions.NW,
		'[-1,0]': Directions.N,
		'[-1,1]': Directions.NE,
		'[0,-1]': Directions.W,
		'[0,1]': Directions.E,
		'[1,-1]': Directions.SW,
		'[1,0]': Directions.S,
		'[1,1]': Directions.SE,
	};

	/**
	 * Returns the positions of the 8 neighbors of a cell in the burn matrix
	 * @param position | [x, y] position of cell in matrix
	 */
	neighbors(): Cell[] {
		const [x, y] = this.position;
		let neighbors = [];
		for (let j = -1; j <= 1; j++) {
			for (let i = -1; i <= 1; i++) {
				if (!(i === 0 && j === 0)) {
					const distanceTo = i * j === 0 ? 1 : ROOT2;
					neighbors.push(
						new NeighborCell(
							this.matrixPositionToLayerPoint([x + i, y + j]),
							this.extent,
							this,
							distanceTo,
							Cell.neighborsMap[JSON.stringify([i, j])]
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

	/**
	 * Returns data for all data types for the Cell
	 */
	getData() {
		// const { elevation } = this.extent.getPixelValuesAt(this.layerPoint);
		const elevation = getElevation(this.layerPoint);
		return { elevation };
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

/**
 * NeightCell is a specialized Cell type when referring to a Cell's neighbors
 * Must be in same file due to cicular class reference issues
 * See constructor comments for more detail
 */
class NeighborCell extends Cell {
	/**
	 * Central cell in the Moore neighborhood
	 */
	originCell: Cell;
	/**
	 * Bearing from the origin cell to this neighbor
	 */
	bearing: Bearings;
	/**
	 * Coefficient to multiply average distance by
	 */
	distanceCoefficient: DistanceCoefficients;
	/**
	 * Direction of neighbor relative to origin cell
	 */
	directionFromOrigin: Directions;

	/**
	 * NeighCell is a specialized Cell type when referring to a Cell's neighbors.  It has additional properties
	 * and methods that make calculation of fire spread probability easier, such as:
	 * - Slope calculator between origin cell and this cell
	 * - Fire spread probability calculator based on ground fuel of origin and this cell
	 * @param {Cell} originCell | Cell that this NeighborCell is in reference to
	 * @param {DistanceCoefficients} distanceCoefficient | What to multiply the average Extent distance by
	 * @param {Directions} directionFromOrigin | Name to help identify NeighborCell position relative to cell
	 */
	constructor(
		layerPoint: L.Point,
		extent: Extent,
		originCell: Cell,
		distanceCoefficient: DistanceCoefficients,
		directionFromOrigin: Directions
	) {
		super(layerPoint, extent);
		this.originCell = originCell;
		this.distanceCoefficient = distanceCoefficient;
		this.directionFromOrigin = directionFromOrigin;
	}

	/**
	 * Calculates the slope between the origin Cell of the Moore neighborhood
	 * and this NeighborCell in that neighborhood
	 * @returns Slope between origin Cell to this NeighborCell
	 */
	getSlopeFromOriginCell() {
		const elevation = getElevation(this.layerPoint);
		const originCellElevation = getElevation(this.originCell.layerPoint);

		const dElev = elevation - originCellElevation;
		const distance = this.extent.averageDistance;

		return Math.atan(dElev / distance).round();
	}
}

export default Cell;
