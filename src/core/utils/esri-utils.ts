/**
 * Firestarter.io
 *
 * Utility functions for working with esri resources
 * Based heavily on functions from esri-leaflet source code
 * https://github.com/Esri/esri-leaflet
 */

import fetch from 'node-fetch';
import * as L from 'leaflet';
import { scale } from '@config';
import { Bounds, latLng, latLngBounds, bounds, Point } from 'leaflet';
import { MapBounds } from 'typings/gis';
import { ImageRequestOptions } from '../../typings/esri';
import { loadImage, Image, createCanvas } from 'canvas';
import { simplifyBoundsArray } from './geometry/Bounds';
import { ImageDataCache } from '@data';
import { getRGBfromImgData } from './rgba';

/**
 * Token getter function for ESRI authenticated services
 * @param client_id | Esri client ID
 * @param client_secret | Esri Client Secret
 * @param expiration | Token expiration time
 */
export async function getEsriToken(
	client_id: string,
	client_secret: string,
	expiration: number = 3.6e6
) {
	const authservice = 'https://www.arcgis.com/sharing/rest/oauth2/token';
	const url = `${authservice}?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials&expiration=${expiration}`;

	let token: undefined | string;

	await fetch(url, {
		method: 'POST',
	})
		.then((res) => res.json())
		.then((res) => {
			token = res.access_token;
		})
		.catch((error) => {
			console.error(error);
			return error;
		});

	return token;
}

// convert an extent (ArcGIS) to LatLngBounds (Leaflet)
export function extentToBounds(extent) {
	// "NaN" coordinates from ArcGIS Server indicate a null geometry
	if (
		extent.xmin !== 'NaN' &&
		extent.ymin !== 'NaN' &&
		extent.xmax !== 'NaN' &&
		extent.ymax !== 'NaN'
	) {
		var sw = latLng(extent.ymin, extent.xmin);
		var ne = latLng(extent.ymax, extent.xmax);
		return latLngBounds(sw, ne);
	} else {
		return null;
	}
}

// convert an LatLngBounds (Leaflet) to extent (ArcGIS)
export function boundsToExtent(bounds: MapBounds) {
	return {
		xmin: bounds._southWest.lng,
		ymin: bounds._southWest.lat,
		xmax: bounds._northEast.lng,
		ymax: bounds._northEast.lat,
		spatialReference: {
			wkid: 4326,
		},
	};
}

interface NewRequestOptions extends ImageRequestOptions {
	url: string;
}

/**
 * Util class for requesting and interpereting esri raster data sources
 */
export class EsriRasterDataSource {
	_url: string;
	_options: ImageRequestOptions;
	_bounds: L.LatLngBoundsLiteral;
	_layerJSON: any;
	_bboxes: { bounds: Bounds; url: string }[];
	_cache: ImageDataCache;

	constructor(options: NewRequestOptions) {
		const { url, ...rest } = options;
		this._url = options.url;
		this._options = rest;
		this._bboxes = [];
		this._cache = options.dataCache;
	}

	/**
	 * fetch layer JSON and store in instance
	 */
	private async _fetchJson() {
		const response = await fetch(this._url + '?f=json');
		const esriJSON = await response.json();
		this._layerJSON = esriJSON;
	}

	/**
	 * request image based on bounds
	 * @param llBounds | LatLngBounds of desired image
	 */
	public async fetchImage(latLngBoundsArray: MapBounds[]) {
		if (!this._layerJSON) {
			await this._fetchJson();
		}

		latLngBoundsArray = simplifyBoundsArray(latLngBoundsArray);

		const fullUrls = latLngBoundsArray.map((llBounds: MapBounds) =>
			this._buildImageUrl(llBounds)
		);

		await Promise.all(
			latLngBoundsArray.map((llBounds: MapBounds, i: number) => {
				console.log('fullUrl:\n', fullUrls[i]);
				return loadImage(fullUrls[i]);
			})
		).then((images: Image[]): void => {
			images.forEach((image: Image, i: number) => {
				const canvas = createCanvas(image.width, image.height);
				const ctx = canvas.getContext('2d');
				ctx.drawImage(image, 0, 0, image.width, image.height);
				this._cache[fullUrls[i]] = ctx.getImageData(
					0,
					0,
					image.width,
					image.height
				);
			});
		});
	}

	/**
	 * Calculates size of desired image
	 * @param llBounds | LatLngBounds of desired image
	 */
	private _calculateImageSize(llBounds: MapBounds) {
		const mapBounds: L.LatLngBounds = latLngBounds(
			llBounds._southWest,
			llBounds._northEast
		);

		const se = mapBounds.getSouthEast();
		const nw = mapBounds.getNorthWest();

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
	private _calculateBbox(llBounds: MapBounds): string {
		const mapBounds: L.LatLngBounds = latLngBounds(
			llBounds._southWest,
			llBounds._northEast
		);

		const neProjected: Point = L.CRS.EPSG3857.project(mapBounds.getNorthEast());
		const swProjected: Point = L.CRS.EPSG3857.project(mapBounds.getSouthWest());

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
	private _buildImageUrl(llBounds: MapBounds): string {
		// Duplicate logic from getBbox - can be more DRY?
		const mapBounds: L.LatLngBounds = latLngBounds(
			llBounds._southWest,
			llBounds._northEast
		);

		const neProjected: Point = L.CRS.EPSG3857.project(mapBounds.getNorthEast());
		const swProjected: Point = L.CRS.EPSG3857.project(mapBounds.getSouthWest());

		// this ensures ne/sw are switched in polar maps where north/top bottom/south is inverted
		var boundsProjected: Bounds = bounds(
			neProjected as any,
			swProjected as any
		);

		const exportType = this._options?.exportType || 'exportImage';
		const params = this._buildExportParams(llBounds);
		var fullUrl = this._url + `/${exportType}` + L.Util.getParamString(params);

		// Stash bounds and url for reference, required in getPixelAt to reference which image to use
		this._bboxes.push({
			bounds: boundsProjected,
			url: fullUrl,
		});

		return fullUrl;
	}

	/**
	 * Function to get the pixel value of the esri image at the given latlng
	 * @param latLng | LatLng
	 */
	public getPixelAt(latLng: L.LatLngLiteral) {
		const projectedPoint = L.CRS.EPSG3857.project(latLng);
		const { bounds, url } = this._bboxes.find((box) =>
			box.bounds.contains(projectedPoint)
		);

		const size = bounds.getSize();
		const position = projectedPoint.subtract(bounds.getBottomLeft());

		const xRatio = Math.abs(position.x / size.x);
		const yRatio = Math.abs(position.y / size.y);

		const imageData = this._cache[url];

		const xPositionOnImage = Math.floor(xRatio * imageData.width);
		const yPositionOnImage = Math.floor(yRatio * imageData.height);

		const RGBA = getRGBfromImgData(
			imageData,
			xPositionOnImage,
			yPositionOnImage
		);

		console.log('\n\nRGBA', RGBA);
	}

	/**
	 * Function to build export parameters for esri request of desired image
	 * @param llBounds | Map bounds of desired image
	 * @param options | Options
	 */
	private _buildExportParams(llBounds: MapBounds) {
		const sr = parseInt(L.CRS.EPSG3857.code.split(':')[1], 10);
		const params: any = {
			bbox: this._calculateBbox(llBounds),
			size: this._calculateImageSize(llBounds),
			format: this._options?.format || 'png',
			bboxSR: sr,
			imageSR: sr,
			f: this._options?.f || 'image',
		};

		if (this._options?.token) {
			params.token = this._options.token;
		}

		if (this._options?.renderingRule) {
			params.renderingRule = JSON.stringify(this._options.renderingRule);
		}

		if (this._options?.mosaicRule) {
			params.mosaicRule = JSON.stringify(this._options.mosaicRule);
		}

		if (this._options?.sr) {
			params.bboxSR = this._options.sr;
			params.imageSR = this._options.sr;
		}

		if (this._options?.sublayer) {
			params.layers = `show:${this._options.sublayer}`;
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
		const legendUrl = `${this._url}/legend?f=pjson`;
		let layerJSON, legend, rgbValues;

		const canvas = createCanvas(20, 20);
		const ctx = canvas.getContext('2d');

		// Get JSON of layer / sublayer's legend
		await fetch(legendUrl)
			.then((res) => res.json())
			.then((data) => {
				const layerId = this._options.sublayer || 0;
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
				console.log({ R, G, B, A });
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
