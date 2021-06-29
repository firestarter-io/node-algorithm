/**
 * Firestarter.io
 *
 * Routes for /api/campaign
 */

// POST /api/campaign

import * as L from 'leaflet';
import { refitBoundsToMapTiles } from '@utils/geometry/bounds';
import { createDEM } from '@getdata/dem';
import { getTopography } from '@core/getData/getTopography';
import Campaign from '@core/burncode/Campaign';
import { fetchWeather, fetchWeatherRange } from '@core/getdata/weather';
import chalk = require('chalk');

let camp: Campaign;

export const campaign = async (req, res) => {
	const { mapBounds, pixelBounds, zoom } = req.body;
	const latlng: L.LatLngLiteral = req.body.latlng;

	// Get DEM tiles for map bounds
	mapBounds &&
		createDEM(L.latLngBounds(mapBounds._southWest, mapBounds._northEast));
	if (latlng) {
		// const topo = await getTopography(L.latLng(latlng));
		// console.log(topo);
		if (!camp) {
			camp = new Campaign(L.latLng(latlng));
			// @ts-ignore
			globalThis.camp = camp;
			await camp.initialize();
			res.send({ extentBounds: camp.extents[0].latLngBounds });
		} else {
			camp.extents[0].getPixelValuesAt(L.latLng(latlng));
			await camp.startFire(L.latLng(latlng));
			const weather = await fetchWeatherRange(
				latlng,
				camp.startTime,
				camp.startTime
			);
			console.log(weather);
		}
	}
	// latlng && console.log(new L.LatLng(latlng.lat, latlng.lng));
	// latlng && zoom && console.log(topo);

	// Pseudocode for new campaign logic flow
	// process req.body
	// .then(preload all data for initial bounds)
	// .then(calculate fire spread step by step)
	// .then(return response to client)

	// SATELLITE IMAGERY IMAGE REQUEST --------------------------------------------
	// const satelliteRequest = new EsriRasterDataSource(
	// 	'https://landsat.arcgis.com/arcgis/rest/services/Landsat/PS/ImageServer/'
	// );
	// satelliteRequest.fetchImage(paddedBounds);

	// GROUNDCOVER IMAGE REQUEST (AUTHENTICATED) ----------------------------------
	// getEsriToken(
	// 	process.env.ESRI_FS_CLIENT_ID,
	// 	process.env.ESRI_FS_CLIENT_SECRET
	// ).then((token) => {
	// 	const GroundcoverRequest = new EsriRasterDataSource(
	// 		'https://landscape6.arcgis.com/arcgis/rest/services/World_Land_Cover_30m_BaseVue_2013/ImageServer'
	// 	);
	// 	GroundcoverRequest.fetchImage(paddedBounds, { token });
	// });

	res.send('good job ahole');
};
