/**
 * Firestarter.io
 *
 * Utility class to define a map extent, fetch its data, and build a burn matrix
 * with references required to map pixels to raster data and latlngs
 */

import * as L from 'leaflet';
import { log } from '@core/utils/Logger';
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
import { scale, tileSize, tilesToExpand } from '@config';
import { math } from '@core/utils/math';
import { Matrix } from 'mathjs';
import Cell from './Cell';
import { getTopography } from '@core/getData/getTopography';

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
	}

	/**
	 * Will fetch all relevant data for the map extent
	 */
	public async fetchData() {
		/**
		 *  Generate Digital Elevation Model for extent:
		 */
		log(`${log.emojis.fetch} Fetching DEM . . .`);
		try {
			await createDEM(this.latLngBounds);
			log(`${log.emojis.successCheck} DEM Loaded`);
		} catch (e) {
			log(`${log.emojis.errorX}`, e);
		}
		/**
		 *  Get Groundcover Vegetation Condition
		 */
		log(`${log.emojis.fetch} Fetching Vegetation Condition . . .`);
		try {
			await LandfireVegetationCondition.fetchTiles(this.latLngBounds);
			log(`${log.emojis.successCheck} Vegetation Condition Loaded`);
		} catch (e) {
			log(`${log.emojis.errorX}`, e);
		}
		/**
		 * Get groundcover vegetation type
		 */
		log(`${log.emojis.fetch} Fetching Vegetation Type . . .`);
		try {
			await LandfireFuelVegetationType.fetchTiles(this.latLngBounds);
			log(`${log.emojis.successCheck} Vegetation Type Loaded`);
		} catch (e) {
			log(`${log.emojis.errorX}`, e);
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

		const vegetationCondition = LandfireVegetationCondition.getPixelValueAt(
			coord,
			this.origin
		);

		const fuelVegetationType = LandfireFuelVegetationType.getPixelValueAt(
			coord,
			this.origin
		);

		const { slope, aspect } = getTopography(point);

		const data = {
			slope,
			aspect,
			vegetationCondition,
			fuelVegetationType,
		};

		console.log(data);

		return data;
	}

	/**
	 * Expands Extent downward, performs all resizing and data fetching of new data
	 * @param {Number} noOfTiles | Number of tiles to expand extent by
	 */
	expandDown(noOfTiles: number = tilesToExpand) {
		const morePixels = noOfTiles * tileSize;

		// Adjust height, resize burn matrix:
		this.height = this.height + morePixels;
		this.burnMatrix.resize(this.width, this.height);

		// Determine new bounds and latLngBounds:
		this.pixelBounds = this.pixelBounds.extend(
			L.point(
				this.pixelBounds.getBottomLeft().x,
				this.pixelBounds.getBottomLeft().y + morePixels
			)
		);
		this.latLngBounds = pixelBoundsToLatLngBounds(this.pixelBounds);

		// Fetch data for new bounds:
		log('Expanding Extent:');
		this.fetchData();
	}

	/**
	 * Expands Extent to the right, performs all resizing and data fetching of new data
	 * @param {Number} noOfTiles | Number of tiles to expand extent by
	 */
	expandRight(noOfTiles: number = tilesToExpand) {
		const morePixels = noOfTiles * tileSize;

		// Adjust height, resize burn matrix:
		this.width = this.width + morePixels;
		this.burnMatrix.resize(this.width, this.height);

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
	expandUp(noOfTiles: number = tilesToExpand) {
		const morePixels = noOfTiles * tileSize;

		// Adjust height and origin
		this.height = this.height + morePixels;
		this.origin = L.point(this.origin.x, this.origin.y - morePixels);

		// Resize burn matrix and clone old version to correct position:
		const newArea = math.zeros(morePixels, this.width, 'sparse');
		const oldArea = this.burnMatrix.clone();
		this.burnMatrix.matrix = math.sparse(
			math.concat(newArea, oldArea, 0)
		) as Matrix;

		// Reposition all burning / burned out / supressed cells relative to new origin
		this.burnMatrix.trackedCells.forEach((cellType: Cell[]) => {
			cellType.forEach((cell: Cell) => {
				cell.position = [cell.position[0], cell.position[1] + morePixels];
			});
		});

		// Determine new bounds and latLngBounds:
		this.pixelBounds = this.pixelBounds.extend(
			L.point(
				this.pixelBounds.getBottomLeft().x,
				this.pixelBounds.getBottomLeft().y - morePixels
			)
		);
		this.latLngBounds = pixelBoundsToLatLngBounds(this.pixelBounds);

		// Fetch data for new bounds:
		this.fetchData();
	}

	/**
	 * Expands Extent to the left, performs all resizing and data fetching of new data
	 * Restructures matrix and reindexes all cell tracking variables to the new coordinates
	 * @param {Number} noOfTiles | Number of tiles to expand extent by
	 */
	expandLeft(noOfTiles: number = tilesToExpand) {
		const morePixels = noOfTiles * tileSize;

		// Adjust height and origin
		this.width = this.width + morePixels;
		this.origin = L.point(this.origin.x - morePixels, this.origin.y);

		// Resize burn matrix and clone old version to correct position:
		const newArea = math.zeros(this.height, morePixels, 'sparse');
		const oldArea = this.burnMatrix.clone();
		this.burnMatrix.matrix = math.sparse(
			math.concat(newArea, oldArea)
		) as Matrix;

		// Reposition all burning / burned out / supressed cells relative to new origin
		this.burnMatrix.trackedCells.forEach((cellType: Cell[]) => {
			cellType.forEach((cell: Cell) => {
				cell.position = [cell.position[0] + morePixels, cell.position[1]];
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
