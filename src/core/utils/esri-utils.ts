/**
 * Firestarter.io
 *
 * Utility functions for working with esri resources
 * Based heavily on functions from esri-leaflet source code
 * https://github.com/Esri/esri-leaflet
 */

import fetch from 'node-fetch';
import * as L from 'leaflet';
import { scale } from '../../config';
import { Bounds, latLng, latLngBounds, bounds, Point } from 'leaflet';
import { MapBounds } from '../../types/gis.types';
import { ImageRequestOptions } from '../../types/esri.types';
import { loadImage, Image, createCanvas } from 'canvas';
import { simplifyBoundsArray } from './geometry/Bounds';

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
 * Util class for creating esri image requests
 */
export class EsriImageRequest {
	_url: string;
	_options: ImageRequestOptions;
	_bounds: L.LatLngBoundsLiteral;
	_layerJSON: any;
	_bboxes: Bounds[];

	constructor(options: NewRequestOptions) {
		const { url, ...rest } = options;
		this._url = options.url;
		this._options = rest;
		this._bboxes = [];
	}

	/**
	 * fetch layer JSON and store in instance
	 */
	async _fetchJson() {
		const response = await fetch(this._url + '?f=json');
		const esriJSON = await response.json();
		this._layerJSON = esriJSON;
	}

	/**
	 * request image based on bounds
	 * @param llBounds | LatLngBounds of desired image
	 */
	async fetchImage(latLngBoundsArray: MapBounds[]) {
		if (!this._layerJSON) {
			await this._fetchJson();
		}

		latLngBoundsArray = simplifyBoundsArray(latLngBoundsArray);

		await Promise.all(
			latLngBoundsArray.map((llBounds: MapBounds) => {
				const exportType = this._options?.exportType || 'exportImage';
				const params = this._buildExportParams(llBounds);
				var fullUrl =
					this._url + `/${exportType}` + L.Util.getParamString(params);
				console.log('fullUrl:\n', fullUrl);
				return loadImage(fullUrl);
			})
		).then((images: Image[]): void => {
			images.forEach((image: Image) => {
				// TODO: save image data to canvas for later pixel-by-pixel availability
			});
		});
	}

	/**
	 * Calculates size of desired image
	 * @param llBounds | LatLngBounds of desired image
	 */
	_calculateImageSize(llBounds: MapBounds) {
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
	_calculateBbox(llBounds: MapBounds): string {
		const mapBounds: L.LatLngBounds = latLngBounds(
			llBounds._southWest,
			llBounds._northEast
		);

		const neProjected: Point = L.CRS.EPSG3857.project(
			mapBounds.getNorthEast()
		);
		const swProjected: Point = L.CRS.EPSG3857.project(
			mapBounds.getSouthWest()
		);

		// this ensures ne/sw are switched in polar maps where north/top bottom/south is inverted
		var boundsProjected: Bounds = bounds(
			neProjected as any,
			swProjected as any
		);

		this._bboxes.push(boundsProjected);

		return [
			boundsProjected.getBottomLeft().x,
			boundsProjected.getBottomLeft().y,
			boundsProjected.getTopRight().x,
			boundsProjected.getTopRight().y,
		].join(',');
	}

	/**
	 * Function to get the pixel value of the esri image at the given latlng
	 * @param latLng | LatLng
	 */
	getPixelAt(latLng: L.LatLngLiteral) {
		const projectedPoint = L.CRS.EPSG3857.project(latLng);
		const boundingBox = this._bboxes.find((box) =>
			box.contains(projectedPoint)
		);
		const size = boundingBox.getSize();
		// const position = boundingBox.getBottomLeft().subtract(projectedPoint);
		const position = projectedPoint.subtract(boundingBox.getBottomLeft());

		console.log('projectedPoint', projectedPoint);
		console.log(
			'boundingBox',
			boundingBox,
			'\n\nsize',
			size,
			'\n\nposition',
			position
		);
		console.log(size.x / size.y);
	}

	/**
	 * Function to build export parameters for esri request of desired image
	 * @param llBounds | Map bounds of desired image
	 * @param options | Options
	 */
	_buildExportParams(llBounds: MapBounds) {
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

	async generateLegend() {
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
