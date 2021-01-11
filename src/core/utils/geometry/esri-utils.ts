/**
 * Firestarter.io
 *
 * Utility functions for working with esri resources
 * Based heavily on functions from esri-leaflet source code
 * https://github.com/Esri/esri-leaflet
 */

import fetch from 'node-fetch';
import * as L from 'leaflet';
import { scale } from '../../../config';
import { Bounds, latLng, latLngBounds, bounds, Point } from 'leaflet';
import { MapBounds } from '../../../types/gis.types';
import { roundValues } from '../math';

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
		const response = await fetch(this._url);
		const esriJSON = await response.json();
		this._layerJSON = esriJSON;
	}

	/**
	 * request image based on bounds
	 * @param llBounds | LatLngBounds of desired image
	 */
	async fetchImage(llBounds: MapBounds) {
		if (!this._layerJSON) {
			await this._fetchJson();
		}
		const hello = this._calculateImageSize(llBounds);
		// console.log(hello);
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
	 * Many methods adapted from L.esri.RasterLayer:
	 * https://github.com/Esri/esri-leaflet/blob/5569b703ed9ab2aeb83d57cb55cd1bc940fea38f/src/Layers/RasterLayer.js
	 */
}
