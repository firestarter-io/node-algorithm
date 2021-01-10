import fetch from 'node-fetch';
import { Bounds } from 'leaflet';
import { scale } from '../../../config';
import { MapBounds } from '../../../types/gis.types';
import { project, unproject } from './projections';

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
export function calculateBbox(pixelBounds) {
	var sw = unproject(pixelBounds.getBottomLeft(), scale);
	var ne = unproject(pixelBounds.getTopRight(), scale);

	var neProjected = project(ne, scale);
	var swProjected = project(sw, scale);

	// this ensures ne/sw are switched in polar maps where north/top bottom/south is inverted
	//  var boundsProjected = bounds(neProjected, swProjected);

	//  return [boundsProjected.getBottomLeft().x, boundsProjected.getBottomLeft().y, boundsProjected.getTopRight().x, boundsProjected.getTopRight().y].join(',');
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
		return esriJSON;
	}

	// request image based on bounds
	async fetchImage() {
		if (!this._layerJSON) {
			await this._fetchJson();
		}
		console.log(this._layerJSON);
	}
}
