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
import { EsriImageRequest, getEsriToken } from '../core/utils/esri-utils';
import { MapBounds } from '../types/gis.types';

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

	if (mapBounds) {
		const paddedBounds = mapBounds.map((bounds: MapBounds) =>
			L.latLngBounds(bounds._southWest, bounds._northEast).pad(0.5)
		);

		// const satelliteRequest = new EsriImageRequest(
		// 	'https://landsat.arcgis.com/arcgis/rest/services/Landsat/PS/ImageServer/'
		// );
		// satelliteRequest.fetchImage(paddedBounds);

		getEsriToken(
			process.env.ESRI_FS_CLIENT_ID,
			process.env.ESRI_FS_CLIENT_SECRET
		).then((token) => {
			const groundCoverRequest = new EsriImageRequest(
				'https://landscape6.arcgis.com/arcgis/rest/services/World_Land_Cover_30m_BaseVue_2013/ImageServer'
			);
			groundCoverRequest.fetchImage(paddedBounds, { token });
		});
	}

	res.send('good job ahole');
};
