/**
 * Firestarter.io
 *
 * Cell class to represent a single pixel in an Extent
 */

import * as L from 'leaflet';
import * as lodash from 'lodash';
import { tileSize } from '@config';
import { getElevation } from '@core/getdata/getTopography';
import BurnMatrix from './BurnMatrix';
import Extent from './Extent';
import { CellPosition } from 'typings/firestarter';
import { ROOT2 } from '@core/utils/math';
import { WildfireRisk } from '@core/getdata/rasterSources';

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
	 * The ID of the cell, which is its layerPoint stringified
	 */
	id: string;
	/**
	 * The position of the Cell in its matrix
	 */
	position: CellPosition;
	/**
	 * The position of the cell, stringified.  Used for cell tracking within an Extent
	 */
	pstring: string;
	/**
	 * The BurnMatrix that the Cell belongs to
	 */
	_burnMatrix: BurnMatrix;
	/**
	 * The Extent that the Cell belongs to
	 */
	_extent: Extent;

	/**
	 * A Cell represents a single pixel in a burn matrix
	 * @param layerPoint | layer point of the Cell's position
	 * @param extent | The Extent that the Cell belongs to
	 */
	constructor(layerPoint: L.Point, extent: Extent) {
		this.layerPoint = layerPoint;
		this.id = JSON.stringify(layerPoint);
		this._extent = extent;
		this._burnMatrix = extent.burnMatrix;
		this.position = this.layerPointToMatrixPosition(layerPoint);
		this.pstring = JSON.stringify(this.position);
	}

	/**
	 * Mapping of NeighborCell position in generation loop tp its cardinal direction name
	 */
	static neighborsMap = {
		'[-1,-1]': Directions.NW,
		'[-1,0]': Directions.N,
		'[-1,1]': Directions.NE,
		'[0,-1]': Directions.W,
		'[0,1]': Directions.E,
		'[1,-1]': Directions.SW,
		'[1,0]': Directions.S,
		'[1,1]': Directions.SE,
	} as const;

	/**
	 * Returns the positions of the 8 neighbors of a cell in the burn matrix
	 * @param position | [x, y] position of cell in matrix
	 */
	neighbors(): NeighborCell[] {
		const [x, y] = this.position;
		let neighbors = [];
		for (let j = -1; j <= 1; j++) {
			for (let i = -1; i <= 1; i++) {
				if (!(i === 0 && j === 0)) {
					const distanceTo = i * j === 0 ? 1 : ROOT2;
					neighbors.push(
						new NeighborCell(
							this.matrixPositionToLayerPoint([x + i, y + j]),
							this._extent,
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
			layerPoint.x - this._extent.origin.x,
			layerPoint.y - this._extent.origin.y,
		];
	}

	/**
	 * Takes in cell position in matrix and returns its leaflet layerPoint
	 * @param position | [x, y] position of Cell in matrix
	 */
	matrixPositionToLayerPoint(position: CellPosition) {
		return new L.Point(
			position[0] + this._extent.origin.x,
			position[1] + this._extent.origin.y
		);
	}

	/**
	 * Returns the burn status for the cell
	 */
	get burnStatus() {
		return this._burnMatrix.get(this.position);
	}

	/**
	 * Sets the burn status of the cell
	 * @param burnStatus | Number representing a burn status,
	 */
	setBurnStatus(burnStatus: number) {
		this._burnMatrix.setBurnStatus(this, burnStatus);
	}

	/**
	 * Calculates the burn status of the cell and sets it
	 * @returns the burn status of the cell after calculation
	 */
	calculateBurnStatus(touched: boolean) {
		/* If cell is unburned: */
		if (this.burnStatus === 0 && Math.random() <= this.groundcoverIgnitionP) {
			this.setBurnStatus(1);
		}
		/* If cell is already burning: */
		if (this.burnStatus >= 1 && !touched) {
			this.setBurnStatus(this.burnStatus + 1);
		}

		return this.burnStatus;
	}

	/**
	 * Wildfire ignition probability based solely on groundcover fuels, not accounting
	 * for wind, himidity, or other factors.
	 *
	 * Currently using USFS Probabalistic Wildfire Risk raster dataset
	 *
	 * @returns {number} P - probability, as a fraction of 1
	 */
	get groundcoverIgnitionP() {
		const fireRisk = WildfireRisk.getValueAt(this.layerPoint);
		if (fireRisk === '0') {
			return 0;
		} else {
			const [minRisk, maxRisk] = fireRisk.replace(' - ', ',').split(',');
			const P = lodash.random(minRisk, maxRisk).round(3);
			return P;
		}
	}

	/**
	 * Returns data for all data types for the Cell
	 */
	get data() {
		const gcP = this.groundcoverIgnitionP;
		return gcP;
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
		const dRight = this._extent.width - x;
		const dTop = y;
		const dBottom = this._extent.height - y;

		if (dLeft < tileSize * buffer) {
			this._extent.expandLeft();
		}

		if (dRight < tileSize * buffer) {
			this._extent.expandRight();
		}

		if (dTop < tileSize * buffer) {
			this._extent.expandUp();
		}

		if (dBottom < tileSize * buffer) {
			this._extent.expandDown();
		}
	}
}

/**
 * NeightCell is a specialized Cell type used when referring to a Cell's neighbors.
 * See constructor comments for more detail.
 */
export class NeighborCell extends Cell {
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
		const distance = this._extent.averageDistance * this.distanceCoefficient;

		return Math.atan(dElev / distance).round();
	}

	/**
	 * Mapping of cardinal direction names to bearing direction from origin cell to neighbor
	 */
	static bearings = {
		[Directions.N]: 0,
		[Directions.NE]: 45,
		[Directions.E]: 90,
		[Directions.SE]: 135,
		[Directions.S]: 180,
		[Directions.SW]: 225,
		[Directions.W]: 270,
		[Directions.NW]: 315,
	} as const;

	/**
	 * Function to get wind component in direction from origin cell to this neighbor
	 */
	getWindComponent() {
		const bearing = NeighborCell.bearings[this.directionFromOrigin];
	}

	/**
	 * Converts the NeighborCell to a simple Cell
	 * @returns Cell
	 */
	toCell() {
		return new Cell(this.layerPoint, this._extent);
	}
}

export default Cell;
