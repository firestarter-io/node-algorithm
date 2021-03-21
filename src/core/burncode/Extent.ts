/**
 * Firestarter.io
 *
 * Utility class to define a map extent, fetch its data, and build a burn matrix
 * with references required to map pixels to raster data and latlngs
 */

import * as L from 'leaflet';
import { Logger } from '@core/utils/Logger';
import {
	pixelBoundsToLatLngBounds,
	refitBoundsToMapTiles,
} from '@utils/geometry/bounds';
import { createDEM, getTileCoord } from '@core/getdata/dem';
import {
	LandfireFuelVegetationType,
	LandfireVegetationCondition,
} from '@core/getdata/rasterSources';
import { EsriRasterDataSource } from '@core/utils/EsriRasterDataSource';
import BurnMatrix from './BurnMatrix';
import { tileCache } from '@data';
import { getRGBfromImgData } from '@core/utils/rgba';
import { scale, tileSize } from '@config';
import { math } from '@core/utils/math';
import { Matrix } from 'mathjs';
import { CellPosition } from 'typings/firestarter';
import Cell from './Cell';

class Extent {
	/**
	 * The latLngBounds of the extent (after refitting)
	 */
	latLngBounds: L.LatLngBounds;
	/**
	 * The projected bounds of the extent (after refitting)
	 */
	bounds: L.Bounds;
	/**
	 * The pixel / layer bounds of the extent after refitting
	 * pixel bounds refer to latlng bounds transformed into
	 * leaflet [layer point]{@link https://leafletjs.com/reference-1.7.1.html#map-latlngtolayerpoint}
	 */
	pixelBounds: L.Bounds;
	/**
	 * The width of the projected bounds
	 */
	width: number;
	/**
	 * The height of the projected bounds
	 */
	height: number;
	/**
	 * The top left corner origin of the projected bounds
	 */
	origin: L.Point;
	/**
	 * Data sources for the extent
	 */
	data: {
		[data: string]: EsriRasterDataSource;
	};
	/**
	 * Matrix with the same size as the bounds of the extent representing burn status of each pixel
	 */
	burnMatrix: BurnMatrix;

	/**
	 * Extent class builds an object containing all required data for a given map extent.
	 * Given a LatLngBounds, Extent offers methods to fetch and store all raster data for the bounds
	 * and it creates a burn matrix with coordinates corresponding the the extent pixel bounds
	 * @param latLngBounds | LatLngBounds to create area for
	 */
	constructor(latLngBounds: L.LatLngBounds) {
		/**
		 * Take in a latlngbounds and refit those bounds to cleaner dimensions
		 * Height and width of bounds will be multiple of 256
		 */
		const {
			refitBounds: bounds,
			refitLatLngBounds: llbounds,
			refitPixelBounds: pixelBounds,
		} = refitBoundsToMapTiles(latLngBounds);
		/**
		 * Keep all values available on instance:
		 */
		this.latLngBounds = llbounds;
		this.pixelBounds = pixelBounds;
		this.width = pixelBounds.getSize().x;
		this.height = pixelBounds.getSize().y;
		this.origin = pixelBounds.getTopLeft();
		this.burnMatrix = new BurnMatrix(this.width, this.height, this);
		this.data = {};
	}

	/**
	 * Will fetch all relevant data for the map extent
	 */
	public async fetchData() {
		/**
		 *  Generate Digital Elevation Model for extent:
		 */
		Logger.log(`${Logger.emojis.fetch} Fetching DEM . . .`);
		try {
			await createDEM(this.latLngBounds);
			Logger.log(`${Logger.emojis.successCheck} DEM Loaded`);
		} catch (e) {
			Logger.log(`${Logger.emojis.errorX}`, e);
		}
		/**
		 *  Get Groundcover Vegetation Condition
		 */
		Logger.log(`${Logger.emojis.fetch} Fetching Vegetation Condition . . .`);
		try {
			// await LandfireVegetationCondition.fetchImage(this.latLngBounds);
			// this.data['LandfireVegetationCondition'] = LandfireVegetationCondition;
			await LandfireVegetationCondition.fetchTiles(this.latLngBounds);
			Logger.log(`${Logger.emojis.successCheck} Vegetation Condition Loaded`);
		} catch (e) {
			Logger.log(`${Logger.emojis.errorX}`, e);
		}
		/**
		 * Get groundcover vegetation type
		 */
		Logger.log(`${Logger.emojis.fetch} Fetching Vegetation Type . . .`);
		try {
			// await LandfireFuelVegetationType.fetchImage(this.latLngBounds);
			// this.data['LandfireFuelVegetationType'] = LandfireVegetationCondition;
			await LandfireFuelVegetationType.fetchTiles(this.latLngBounds);
			Logger.log(`${Logger.emojis.successCheck} Vegetation Type Loaded`);
		} catch (e) {
			Logger.log(`${Logger.emojis.errorX}`, e);
		}
	}

	/**
	 * Compare all extents in the campaign and merge them when they overlap,
	 * called when a new extent is created or when an existing extent grows
	 */
	compareExents() {}

	/**
	 * Returns data values f
	 */
	getPixelValuesAt(coord: L.LatLng | L.Point) {
		let point: L.Point;
		if (coord instanceof L.LatLng) {
			point = L.CRS.EPSG3857.latLngToPoint(coord, scale).round();
		} else if (coord instanceof L.Point) {
			point = coord;
		} else {
			console.log(
				'Something is wrong with the coordinate type fed to getPixelValuesAt'
			);
		}

		const { X, Y, Z } = getTileCoord(point);
		const tileName = `${Z}/${X}/${Y}`;
		const tile = tileCache.LandfireVegetationCondition[tileName];

		const xyPositionOnTile = {
			x: point.x - X * 256,
			y: point.y - Y * 256,
		};

		const vegetationCondition = getRGBfromImgData(
			tile,
			xyPositionOnTile.x,
			xyPositionOnTile.y
		);

		console.log(vegetationCondition);
	}

	/**
	 * Expands Extent downward, performs all resizing and data fetching of new data
	 * @param {Number} noOfTiles | Number of tiles to expand extent by
	 */
	expandDown(noOfTiles: number = 2) {
		const morePixels = noOfTiles * tileSize;

		// Adjust height, resize burn matrix:
		this.height = this.height + morePixels;
		this.burnMatrix.matrix.resize([this.width, this.height]);

		// Determine new bounds and latLngBounds:
		this.pixelBounds = this.pixelBounds.extend(
			L.point(
				this.pixelBounds.getBottomLeft().x,
				this.pixelBounds.getBottomLeft().y + morePixels
			)
		);
		this.latLngBounds = pixelBoundsToLatLngBounds(this.pixelBounds);

		// Fetch data for new bounds:
		Logger.log('Expanding Extent:');
		this.fetchData();
	}

	/**
	 * Expands Extent to the right, performs all resizing and data fetching of new data
	 * @param {Number} noOfTiles | Number of tiles to expand extent by
	 */
	expandRight(noOfTiles: number = 2) {
		const morePixels = noOfTiles * tileSize;

		// Adjust height, resize burn matrix:
		this.width = this.width + morePixels;
		this.burnMatrix.matrix.resize([this.width, this.height]);

		// Determine new bounds and latLngBounds:
		this.pixelBounds = this.pixelBounds.extend(
			L.point(
				this.pixelBounds.getBottomLeft().x + morePixels,
				this.pixelBounds.getBottomLeft().y
			)
		);
		this.latLngBounds = pixelBoundsToLatLngBounds(this.pixelBounds);

		// Fetch data for new bounds:
		this.fetchData();
	}

	/**
	 * Expands Extent upwards, performs all resizing and data fetching of new data
	 * Restructures matrix and reindexes all cell tracking variables to the new coordinates
	 * @param {Number} noOfTiles | Number of tiles to expand extent by
	 */
	expandUp(noOfTiles: number = 2) {
		const morePixels = noOfTiles * tileSize;

		// Adjust height and origin
		this.height = this.height + morePixels;
		this.origin = L.point(this.origin.x - morePixels, this.origin.y);

		// Resize burn matrix and clone old version to correct position:
		const newArea = math.zeros(this.width, morePixels, 'sparse');
		this.burnMatrix.matrix = math.concat(
			newArea,
			this.burnMatrix.matrix,
			0
		) as Matrix;
		// Adjust origin
		this.origin = L.point(this.origin.x, this.origin.y - morePixels);

		// Reposition all burning / burned out / supressed cells relative to new origin
		this.burnMatrix.trackedCells.forEach((cellType: Cell[]) => {
			cellType.forEach((cell: Cell) => {
				cell.position = [cell.position[0], cell.position[1] + morePixels];
			});
		});

		// Determine new bounds and latLngBounds:
		this.pixelBounds = this.pixelBounds.extend(
			L.point(
				this.pixelBounds.getBottomLeft().x - morePixels,
				this.pixelBounds.getBottomLeft().y
			)
		);
		this.latLngBounds = pixelBoundsToLatLngBounds(this.pixelBounds);

		// Fetch data for new bounds:
		this.fetchData();
	}
}

export default Extent;
