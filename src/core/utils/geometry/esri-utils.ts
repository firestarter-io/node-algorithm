import fetch from 'node-fetch';
import { Bounds, latLng, latLngBounds, bounds, point } from 'leaflet';
import { scale } from '../../../config';
import { MapBounds } from '../../../types/gis.types';
import { project, unproject } from './projections';

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

// https://github.com/Esri/esri-leaflet/blob/5569b703ed9ab2aeb83d57cb55cd1bc940fea38f/src/Layers/RasterLayer.js
export function calculateBbox(pxBounds) {
	const min = point(pxBounds.min);
	const max = point(pxBounds.max);

	console.log(min, max);

	const pixelBounds = bounds(min, max);
	console.log(pixelBounds);

	var sw = unproject(pixelBounds.getBottomLeft(), scale);
	var ne = unproject(pixelBounds.getTopRight(), scale);

	var neProjected = project(ne, scale);
	var swProjected = project(sw, scale);

	// this ensures ne/sw are switched in polar maps where north/top bottom/south is inverted
	var boundsProjected = bounds(neProjected as any, swProjected as any);

	return [
		boundsProjected.getBottomLeft().x,
		boundsProjected.getBottomLeft().y,
		boundsProjected.getTopRight().x,
		boundsProjected.getTopRight().y,
	].join(',');
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

	// fetch layer JSON and store in instance
	async _fetchJson() {
		const response = await fetch(this._url);
		const esriJSON = await response.json();
		this._layerJSON = esriJSON;
	}

	// request image based on bounds
	async fetchImage(pixelBounds) {
		if (!this._layerJSON) {
			await this._fetchJson();
		}
		const hello = calculateBbox(pixelBounds);
		console.log(hello);
	}
}
