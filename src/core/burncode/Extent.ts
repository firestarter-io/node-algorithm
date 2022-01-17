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
 * Utility class to define a map extent, fetch its data, and build a burn matrix
 * with references required to map pixels to raster data and latlngs
 */

import * as L from 'leaflet';
import logger, { emojis } from '@core/utils/Logger';
import {
	pixelBoundsToLatLngBounds,
	refitBoundsToMapTiles,
} from '@utils/geometry/bounds';
import { createDEM } from '@core/getdata/dem';
import { FBFuelModels13, FBFuelModels40 } from '@core/getdata/rasterSources';
import BurnMatrix from './BurnMatrix';
import { scale, tileSize, tilesToExpand } from '@config';
import { math } from '@core/utils/math';
import { Matrix } from 'mathjs';
import Cell from './Cell';
import { getTopography } from '@core/getData/getTopography';
import Campaign from './Campaign';

/**
 * Extent class builds an object containing all required data for a given map extent.
 * Given a LatLngBounds, Extent offers methods to fetch and store all raster data for the bounds
 * and it creates a burn matrix with coordinates corresponding to the extent pixel bounds.
 *
 * ***&#128211; &nbsp; See more in the  [Extent documentation](https://firestarter-io.github.io/node-algorithm/components/extent/extent/)***
 */
class Extent {
	/**
	 * The Campaign that the extent belongs to
	 */
	_campaign: Campaign;
	/**
	 * The latLngBounds of the extent (after refitting)
	 */
	latLngBounds: L.LatLngBounds;
	/**
	 * The string ID of the extent
	 */
	id: string;
	/**
	 * The projected bounds of the extent (after refitting)
	 */
	bounds: L.Bounds;
	/**
	 * The pixel / layer bounds of the extent after refitting
	 * pixel bounds refer to latlng bounds transformed into
	 *  [Leaflet layer point](https://leafletjs.com/reference-1.7.1.html#map-latlngtolayerpoint)
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
	 * Average distance between pixels in the Extent, in meters
	 */
	averageDistance: number;

	/**
	 * Extent class builds an object containing all required data for a given map extent.
	 * Given a LatLngBounds, Extent offers methods to fetch and store all raster data for the bounds
	 * and it creates a burn matrix with coordinates corresponding to the extent pixel bounds
	 * @param latLngBounds | LatLngBounds to create area for
	 */
	constructor(latLngBounds: L.LatLngBounds, campaign: Campaign) {
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
		this._campaign = campaign;
		this.latLngBounds = llbounds;
		this.id = this.latLngBounds.toBBoxString();
		this.pixelBounds = pixelBounds;
		this.width = pixelBounds.getSize().x;
		this.height = pixelBounds.getSize().y;
		this.origin = pixelBounds.getTopLeft();
		this.burnMatrix = new BurnMatrix(this.width, this.height, this);
		this.averageDistance = this.getAverageDistance();
	}

	/**
	 * Will fetch all relevant data for the map extent
	 */
	public async fetchData() {
		/**
		 *  Generate Digital Elevation Model for extent:
		 */
		logger.info(`${emojis.fetch} Fetching DEM . . .`);
		try {
			await createDEM(this.latLngBounds);
			logger.info(`${emojis.successCheck} DEM Loaded`);
		} catch (e) {
			logger.info(`${emojis.errorX}`, e);
		}
		/**
		 *  Get Anderson 13 Fuel Models
		 */
		try {
			await FBFuelModels13.fetchTiles(this.latLngBounds);
		} catch (e) {
			throw e;
		}

		/**
		 *  Get Scott & Burgen Fuel Models
		 */
		try {
			await FBFuelModels40.fetchTiles(this.latLngBounds);
		} catch (e) {
			throw e;
		}
	}

	/**
	 * Compare all extents in the campaign and merge them when they overlap,
	 * called when a new extent is created or when an existing extent grows
	 */
	compareExents() {}

	/**
	 * Computed the distance in meters between pixels, as measure from the extent's
	 * center pixel to a neighbor pixel.  Saves having to compute distances between every
	 * pair of pixels between a Cell and NeighborCell, as those distances will not be
	 * significantly different within a given Extent
	 * @returns | Distance in meters
	 */
	getAverageDistance(): number {
		const center = this.pixelBounds.getCenter().round();
		const centerLatLng = L.CRS.EPSG3857.pointToLatLng(center, scale);
		const onePixelAway = L.point(center.x + 1, center.y);
		const onePixelAwayLatLng = L.CRS.EPSG3857.pointToLatLng(
			onePixelAway,
			scale
		);
		return centerLatLng.distanceTo(onePixelAwayLatLng).round(2);
	}

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
			logger.error(
				'Something is wrong with the coordinate type fed to getPixelValuesAt'
			);
		}

		const fuelModel = FBFuelModels13.getValueAt(coord);

		const { slope, aspect, elevation } = getTopography(point);

		const data = {
			slope,
			aspect,
			elevation,
			fuelModel,
		};

		return data;
	}

	/**
	 * Expands Extent downward, performs all resizing and data fetching of new data
	 * @param {Number} noOfTiles | Number of tiles to expand extent by
	 */
	async expandDown(noOfTiles: number = tilesToExpand) {
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
		logger.info('Expanding extent down');
		await this.fetchData();
	}

	/**
	 * Expands Extent to the right, performs all resizing and data fetching of new data
	 * @param {Number} noOfTiles | Number of tiles to expand extent by
	 */
	async expandRight(noOfTiles: number = tilesToExpand) {
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
		logger.info('Expanding extent right');
		await this.fetchData();
	}

	/**
	 * Expands Extent upwards, performs all resizing and data fetching of new data
	 * Restructures matrix and reindexes all cell tracking variables to the new coordinates
	 * @param {Number} noOfTiles | Number of tiles to expand extent by
	 */
	async expandUp(noOfTiles: number = tilesToExpand) {
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
		this.burnMatrix.trackedCells.forEach((cellType: Map<string, Cell>) => {
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
		logger.info('Expanding extent up');
		await this.fetchData();
	}

	/**
	 * Expands Extent to the left, performs all resizing and data fetching of new data
	 * Restructures matrix and reindexes all cell tracking variables to the new coordinates
	 * @param {Number} noOfTiles | Number of tiles to expand extent by
	 */
	async expandLeft(noOfTiles: number = tilesToExpand) {
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
		this.burnMatrix.trackedCells.forEach((cellType: Map<string, Cell>) => {
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
		logger.info('Expanding extent left');
		await this.fetchData();
	}
}

export default Extent;
