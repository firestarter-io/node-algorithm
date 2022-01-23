/*
 * Firestarter.io
 *
 * Copyright (C) 2022 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

/**
 * Utility class for getting raster data from esri sources
 * Based heavily on functions from esri-leaflet source code
 * https://github.com/Esri/esri-leaflet
 */

import * as path from 'path';
import * as fs from 'fs';
import fetch from 'node-fetch';
import * as L from 'leaflet';
import { Bounds, bounds, Point } from 'leaflet';
import { loadImage, Image, createCanvas, Canvas } from 'canvas';
import { LEGENDS_DIR, saveTile, scale, TILE_DIR } from '~config';
import { DataGroups, ImageDataCache, legends, tileCache } from '~data';
import { getRGBfromImgData, RGBA } from './rgba';
import { getTileCoords, tileCoordToBounds } from './geometry/bounds';
import { TileCoord } from '~types/gis';
import { ImageRequestOptions } from '~types/esri';
import logger, { emojis } from './Logger';
import { getTileCoord } from '~core/getdata/dem';
import { downloadImage, downloadJSON } from '~core/utils/download-utils';

interface NewRequestOptions extends ImageRequestOptions {
	/**
	 * The shortname of the data group, used to tell EsriRasterDataSource where
	 * to store its data in the tileCache / database
	 */
	datagroup: DataGroups;
	/**
	 * Human readable name of the data source for logging purposes
	 */
	name: string;
	/**
	 * The location of the data resource, should be an arcgis server raster data source url
	 */
	url: string;
}

/**
 * Util class for requesting and interpereting esri raster data sources
 */
export class EsriRasterDataSource {
	/**
	 * Shortname of the data source
	 */
	readonly datagroup: DataGroups;
	/**
	 * Long name of the data source
	 */
	readonly name: string;
	/**
	 * Url of the data source
	 */
	readonly url: string;
	/**
	 * Options for the image request
	 */
	readonly options: ImageRequestOptions;
	/**
	 * Bounds of desired image for the raster source
	 */
	readonly bounds: L.LatLngBoundsLiteral;
	/**
	 * The JSON of the ESRI layer
	 */
	layerJSON: object;
	/**
	 * The in-memory database for the processed image data
	 */
	public cache: ImageDataCache;

	constructor(options: NewRequestOptions) {
		const { datagroup, url, name, ...rest } = options;
		this.datagroup = datagroup;
		this.name = name;
		this.url = options.url;
		this.options = rest;
		this.cache = tileCache[datagroup];
	}

	/**
	 * fetch layer JSON and store in instance
	 */
	public async fetchJson() {
		const response = await fetch(this.url + '?f=json');
		const esriJSON = await response.json();
		this.layerJSON = esriJSON;
	}

	/**
	 * request image based on bounds
	 * @param llBounds | LatLngBounds of desired image
	 */
	public async fetchImage(latLngBounds: L.LatLngBounds) {
		if (!this.layerJSON) {
			await this.fetchJson();
		}

		const fullUrl = this.buildImageUrl(latLngBounds);

		const image: Image = await loadImage(fullUrl);

		const canvas = createCanvas(image.width, image.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0, image.width, image.height);
		const imageData = ctx.getImageData(0, 0, image.width, image.height);
		return imageData;
	}

	/**
	 * Requests raster data source in the form of tiles.  EsriRasterDataSource.fetchTiles will determine
	 * what standard tiles from a tileLayer would fit within the given LatLngBounds, get the bounds for
	 * each of those tiles, download each tile, and save it to the tileCache
	 * @param latLngBounds | LatLngBounds where tiles are desired
	 */
	public async fetchTiles(latLngBounds: L.LatLngBounds) {
		if (!legends[this.datagroup]) {
			try {
				await this.generateLegend();
				logger.info(`${emojis.notepad} Legend for ${this.name} ready`);
			} catch (e) {
				logger.error(`${emojis.errorX} Legend failed to fetch`, e);
			}
		}

		logger.info(`${emojis.fetch} Fetching ${this.name} Tiles . . .`);

		try {
			let tileCoords = getTileCoords(latLngBounds, scale);

			/* Filter any tile coordinates that are already in tile cache */
			tileCoords = tileCoords.filter((coord: TileCoord) => {
				const { X, Y, Z } = coord;
				const tilename = `${Z}/${X}/${Y}`;
				if (Object.keys(tileCache[this.datagroup]).includes(tilename)) {
					return false;
				} else {
					return true;
				}
			});

			/* Download tiles as PNGs to local directory */
			await Promise.all(
				tileCoords
					.filter((coord: TileCoord) => {
						const { X, Y, Z } = coord;
						const tilename = `${Z}.${X}.${Y}`;
						const filepath = path.join(
							TILE_DIR,
							`/${this.datagroup}/${tilename}.png`
						);
						return !fs.existsSync(filepath);
					})
					.map((coord: TileCoord) => {
						const { X, Y, Z } = coord;
						const tilename = `${Z}.${X}.${Y}`;
						const coordBounds = tileCoordToBounds(coord);
						const url = this.buildImageUrl(coordBounds);
						const downloadInstructions = {
							tilename,
							tiledir: this.datagroup,
							body: {
								url,
								responseType: 'stream',
							},
						};
						return downloadImage(downloadInstructions);
					})
			);

			/* Read local PNG tiles into a canvas and save imagedata to tileCache object */
			await Promise.all<Image>(
				tileCoords.map((coord: TileCoord) => {
					const { X, Y, Z } = coord;
					const tilename = `${Z}.${X}.${Y}`;

					const url = path.join(TILE_DIR, `/${this.datagroup}/${tilename}.png`);
					return loadImage(url);
				})
			)
				.then((images: Image[]): void => {
					images.forEach((image: Image, index: number) => {
						const canvas: Canvas = createCanvas(256, 256);
						const ctx: RenderingContext = canvas.getContext('2d');
						ctx.drawImage(
							image as unknown as CanvasImageSource,
							0,
							0,
							256,
							256
						);
						const { X, Y, Z } = tileCoords[index];
						const tilename = `${Z}/${X}/${Y}`;
						saveTile(
							this.datagroup,
							tilename,
							ctx.getImageData(0, 0, 256, 256)
						);
					});
				})
				.catch(e => {
					throw e;
				});

			logger.info(`${emojis.successCheck} ${this.name} Tiles Loaded`);
		} catch (e) {
			logger.error(`${emojis.errorX}`, `Problem fetching ${this.name}:\n`, e);
		}
	}

	/**
	 * Calculates size of desired image
	 * @param llBounds | LatLngBounds of desired image
	 */
	private calculateImageSize(latLngBounds: L.LatLngBounds) {
		const se = latLngBounds.getSouthEast();
		const nw = latLngBounds.getNorthWest();

		const topLeft = L.CRS.EPSG3857.latLngToPoint(nw, scale);
		const bottomRight = L.CRS.EPSG3857.latLngToPoint(se, scale);

		const pixelBounds = bounds(topLeft, bottomRight);

		const size = pixelBounds.getSize().round();

		return size.x + ',' + size.y;
	}

	/**
	 * Calculates the bounding box of the desired image
	 * @param llBounds | LatLngBounds of desired image
	 * Adjusted from esri-leaflet/src/Layers/RasterLayer.js to not need an L.Map instance
	 */
	private calculateBbox(latLngBounds: L.LatLngBounds): string {
		const neProjected: Point = L.CRS.EPSG3857.project(
			latLngBounds.getNorthEast()
		);
		const swProjected: Point = L.CRS.EPSG3857.project(
			latLngBounds.getSouthWest()
		);

		// this ensures ne/sw are switched in polar maps where north/top bottom/south is inverted
		const boundsProjected: Bounds = bounds(
			neProjected as any,
			swProjected as any
		);

		return [
			boundsProjected.getBottomLeft().x,
			boundsProjected.getBottomLeft().y,
			boundsProjected.getTopRight().x,
			boundsProjected.getTopRight().y,
		].join(',');
	}

	/**
	 * Takes in a map bounds and generates the image url for those bounds
	 * @param llBounds | Map bounds object
	 */
	private buildImageUrl(latLngBounds: L.LatLngBounds): string {
		const exportType = this.options?.exportType || 'exportImage';
		const params = this.buildExportParams(latLngBounds);
		const fullUrl = this.url + `/${exportType}` + L.Util.getParamString(params);
		return fullUrl;
	}

	/**
	 * Function which returns the RGBA value of a pixel at a given coordinate on
	 * a raster image data source with a given pixel bounds origin
	 * @param coord | Coordinate to get picel at - L.LatLng or L.Point
	 * @param origin | Pixel origin of raster image to get pixel value from
	 */
	public getRGBValueAt(coord: L.LatLng | L.Point) {
		let point;
		if (coord instanceof L.LatLng) {
			point = L.CRS.EPSG3857.latLngToPoint(coord, scale).round();
		} else if (coord instanceof L.Point) {
			point = coord;
		}

		const { X, Y, Z } = getTileCoord(point);
		const tileName = `${Z}/${X}/${Y}`;

		const xyPositionOnTile = {
			x: point.x - X * 256,
			y: point.y - Y * 256,
		};

		const imageData = this.cache[tileName];

		const RGBA = getRGBfromImgData(
			imageData,
			xyPositionOnTile.x,
			xyPositionOnTile.y
		);
		return RGBA;
	}

	/**
	 * Function to compare a raster RGBA pixel value against the legend to get its
	 * symbol value
	 * @param RGBA | The RGBA value of the raster to decode
	 */
	decode(RGBA: RGBA) {
		const legend = legends[this.datagroup];
		const symbol = legend.find(symbol => RGBA.matches(symbol.rgbvalue, 10));
		return symbol.label;
	}

	/**
	 * Takes in a point and returns the raster data's value for the point
	 * according the legend of the layer
	 * @param coord | L.LatLng or L.Point
	 * @param origin | pixelbounds origin of the
	 */
	public getValueAt(coord: L.LatLng | L.Point) {
		const RGBA = this.getRGBValueAt(coord);
		return this.decode(RGBA);
	}

	/**
	 * Function to build export parameters for esri request of desired image
	 * @param llBounds | Map bounds of desired image
	 * @param options | Options
	 */
	private buildExportParams(latLngBounds: L.LatLngBounds) {
		const sr = parseInt(L.CRS.EPSG3857.code.split(':')[1], 10);
		const params: any = {
			bbox: this.calculateBbox(latLngBounds),
			size: this.calculateImageSize(latLngBounds),
			format: this.options?.format || 'png',
			bboxSR: sr,
			imageSR: sr,
			f: this.options?.f || 'image',
		};

		if (this.options?.token) {
			params.token = this.options.token;
		}

		if (this.options?.renderingRule) {
			params.renderingRule = JSON.stringify(this.options.renderingRule);
		}

		if (this.options?.mosaicRule) {
			params.mosaicRule = JSON.stringify(this.options.mosaicRule);
		}

		if (this.options?.sr) {
			params.bboxSR = this.options.sr;
			params.imageSR = this.options.sr;
		}

		if (this.options?.sublayer) {
			params.layers = `show:${this.options.sublayer}`;
		}

		return params;
	}

	/**
	 * This function will fetch the layer's legend JSON from esri, extract the RGB pixel data
	 * from the legend's images, and return the legend JSON with each field appended
	 * with that RGBA data.  Can be used later to 'decode' pixel values of a layer to their
	 * meaning according to the legend.
	 */
	public async generateLegend() {
		let legend;
		const pathToPreexistingJson = path.join(
			LEGENDS_DIR,
			`/${this.datagroup}.legend.json`
		);

		// If JSON has not yet been downloaded in this user session, download it:
		if (!fs.existsSync(pathToPreexistingJson)) {
			logger.info(
				`${emojis.fetch} Fetching ${this.name} legend from remote . . .`
			);

			const legendUrl = `${this.url}/legend?f=pjson`;
			let layerJSON, rgbValues;

			const canvas = createCanvas(20, 20);
			const ctx = canvas.getContext('2d');

			// Get JSON of layer / sublayer's legend
			await fetch(legendUrl)
				.then(res => res.json())
				.then(data => {
					const layerId = this.options.sublayer || 0;
					layerJSON = data.layers.find(layer => layer.layerId == layerId);
				});

			// Transform legend array images into rgbValues
			await Promise.all(
				layerJSON.legend.map(symbol =>
					loadImage(`data:image/png;base64,${symbol.imageData}`)
				)
			).then(symbolImages => {
				rgbValues = symbolImages.map(image => {
					ctx.drawImage(image, 0, 0);
					const [R, G, B, A] = ctx.getImageData(10, 10, 1, 1).data;
					return { R, G, B, A };
				});
				return rgbValues;
			});

			legend = await layerJSON.legend.map((symbol, ind) => ({
				...symbol,
				rgbvalue: rgbValues[ind],
			}));

			const filepath = path.join(LEGENDS_DIR, `/`);

			await downloadJSON(legend, filepath, `${this.datagroup}.legend`);

			// If Legend JSON is already downloaded in this user session, use it instead of fetching it
		} else {
			logger.info(
				`${emojis.fetch} Reading ${this.name} legend from local . . .`
			);

			const rawdata = fs.readFileSync(pathToPreexistingJson, 'utf-8');
			legend = JSON.parse(rawdata);
		}

		legends[this.datagroup] = legend;

		return legend;
	}

	/**
	 * Many methods adapted from L.esri.RasterLayer:
	 * https://github.com/Esri/esri-leaflet/blob/5569b703ed9ab2aeb83d57cb55cd1bc940fea38f/src/Layers/RasterLayer.js
	 */
}
