/**
 * Firestarter.io
 *
 * Utility functions for working with esri resources
 * Based heavily on functions from esri-leaflet source code
 * https://github.com/Esri/esri-leaflet
 */

import fetch from 'node-fetch';
import { latLng, latLngBounds } from 'leaflet';
import { MapBounds } from 'typings/gis';
import { ImageRequestOptions } from '../../typings/esri';

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
