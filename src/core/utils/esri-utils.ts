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

/**
 * Util class for creating esri image requests
 */
export class EsriImageRequest {
	_url: string;
	_bounds: Bounds;
	_layerJSON: any;

	constructor(url: string, bounds?: Bounds) {
		this._url = url;
		this._bounds = bounds;
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
	async fetchImage(llBounds: MapBounds, options?: ImageRequestOptions) {
		if (!this._layerJSON) {
			await this._fetchJson();
		}
		const params = this._buildExportParams(llBounds, options);
		var fullUrl = this._url + 'exportImage' + L.Util.getParamString(params);
		console.log(fullUrl);
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

		let topLeft = L.CRS.EPSG3857.latLngToPoint(nw, scale);
		let bottomRight = L.CRS.EPSG3857.latLngToPoint(se, scale);

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

		var neProjected: Point = L.CRS.EPSG3857.project(mapBounds.getNorthEast());
		var swProjected: Point = L.CRS.EPSG3857.project(mapBounds.getSouthWest());

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
	 * Function to build export parameters for esri request of desired image
	 * @param llBounds | Map bounds of desired image
	 * @param options | Options
	 */
	_buildExportParams(llBounds: MapBounds, options?: ImageRequestOptions) {
		const sr = parseInt(L.CRS.EPSG3857.code.split(':')[1], 10);
		const params: any = {
			bbox: this._calculateBbox(llBounds),
			size: this._calculateImageSize(llBounds),
			format: options?.format || 'png',
			bboxSR: sr,
			imageSR: sr,
			f: options?.format || 'image',
		};

		if (options?.token) {
			params.token = options.token;
		}

		if (options?.renderingRule) {
			params.renderingRule = JSON.stringify(options.renderingRule);
		}

		if (options?.mosaicRule) {
			params.mosaicRule = JSON.stringify(options.mosaicRule);
		}

		return params;
	}

	/**
	 * Many methods adapted from L.esri.RasterLayer:
	 * https://github.com/Esri/esri-leaflet/blob/5569b703ed9ab2aeb83d57cb55cd1bc940fea38f/src/Layers/RasterLayer.js
	 */
}
