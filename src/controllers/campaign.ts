/**
 * Firestarter.io
 *
 * Routes for /api/campaign
 */

// POST /api/campaign

import fetch from 'node-fetch';
import * as L from 'leaflet';
import { createDEM } from '../core/getdata/createDEM';
import { getTopography } from '../core/getData/getTopography';
import { EsriImageRequest } from '../core/utils/geometry/esri-utils';

export const campaign = async (req, res) => {
	const { mapBounds, pixelBounds, latlng, zoom } = req.body;

	// Get DEM tiles for map bounds
	// mapBounds && createDEM(mapBounds);
	// const topo = await getTopography(latlng);
	// latlng && console.log(new L.LatLng(latlng.lat, latlng.lng));
	// latlng && zoom && console.log(topo);

	// Pseudocode for new campaign logic flow
	// process req.body
	// .then(preload all data for initial bounds)
	// .then(calculate fire spread step by step)
	// .then(return response to client)

	// fetch(
	// 	'https://landsat.arcgis.com/arcgis/rest/services/Landsat/PS/ImageServer/?f=json'
	// )
	// 	.then((res) => res.json())
	// 	.then((r) => console.log(r));

	const satelliteRequest = new EsriImageRequest(
		'https://landsat.arcgis.com/arcgis/rest/services/Landsat/PS/ImageServer/?f=json'
	);

	mapBounds && satelliteRequest.fetchImage(mapBounds[0]);

	res.send('good job ahole');
};
