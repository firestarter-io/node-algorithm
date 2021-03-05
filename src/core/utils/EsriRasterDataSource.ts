/**
 * Firestarter.io
 *
 * Utility class for getting raster data from esri sources
 * Based heavily on functions from esri-leaflet source code
 * https://github.com/Esri/esri-leaflet
 */

import fetch from 'node-fetch';
import * as L from 'leaflet';
import { scale } from '@config';
import { Bounds, bounds, Point } from 'leaflet';
import { ImageRequestOptions } from '../../typings/esri';
import { loadImage, Image, createCanvas } from 'canvas';
import { ImageDataCache } from '@data';
import { getRGBfromImgData } from './rgba';

interface NewRequestOptions extends ImageRequestOptions {
	url: string;
}

/**
 * Util class for requesting and interpereting esri raster data sources
 */
export class EsriRasterDataSource {
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
	layerJSON: any;
	/**
	 * The in-memory database for the processed image data
	 */
	public cache: ImageDataCache;

	constructor(options: NewRequestOptions) {
		const { url, ...rest } = options;
		this.url = options.url;
		this.options = rest;
		this.cache = options.dataCache;
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
		this.cache.data = imageData;
		return imageData;
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
		var boundsProjected: Bounds = bounds(
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
		var fullUrl = this.url + `/${exportType}` + L.Util.getParamString(params);
		// console.log(fullUrl);
		return fullUrl;
	}

	/**
	 * Function which returns the RGBA value of a pixel at a given coordinate on
	 * a raster image data source with a given pixel bounds origin
	 * @param coord | Coordinate to get picel at - L.LatLng or L.Point
	 * @param origin | Pixel origin of raster image to get pixel value from
	 */
	public getPixelAt(coord: L.LatLngLiteral, origin: L.Point) {
		let point;
		if (coord instanceof L.LatLng) {
			point = L.CRS.EPSG3857.latLngToPoint(coord, scale);
		} else if (coord instanceof L.Point) {
			point = coord;
		}

		const { x, y } = point.subtract(origin).round();
		const imageData = this.cache.data;
		const RGBA = getRGBfromImgData(imageData, x, y);
		return RGBA;
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
		const legendUrl = `${this.url}/legend?f=pjson`;
		let layerJSON, legend, rgbValues;

		const canvas = createCanvas(20, 20);
		const ctx = canvas.getContext('2d');

		// Get JSON of layer / sublayer's legend
		await fetch(legendUrl)
			.then((res) => res.json())
			.then((data) => {
				const layerId = this.options.sublayer || 0;
				layerJSON = data.layers.find((layer) => layer.layerId == layerId);
			});

		// Transform legend array images into rgbValues
		await Promise.all(
			layerJSON.legend.map((symbol) =>
				loadImage(`data:image/png;base64,${symbol.imageData}`)
			)
		).then((symbolImages) => {
			rgbValues = symbolImages.map((image) => {
				ctx.drawImage(image, 0, 0);
				const [R, G, B, A] = ctx.getImageData(10, 10, 1, 1).data;
				// console.log({ R, G, B, A });
				return { R, G, B, A };
			});
			return rgbValues;
		});

		legend = await layerJSON.legend.map((symbol, ind) => ({
			...symbol,
			rgbvalue: rgbValues[ind],
		}));

		return legend;
	}

	/**
	 * Many methods adapted from L.esri.RasterLayer:
	 * https://github.com/Esri/esri-leaflet/blob/5569b703ed9ab2aeb83d57cb55cd1bc940fea38f/src/Layers/RasterLayer.js
	 */
}