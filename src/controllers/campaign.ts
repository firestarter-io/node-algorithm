/**
 * Firestarter.io
 *
 * Routes for /api/campaign
 */

// POST /api/campaign

import * as L from 'leaflet';
import { createDEM, refitBoundsToMapTiles } from '../core/getdata/createDEM';
import { getTopography } from '../core/getData/getTopography';
import { MapBounds } from '../types/gis.types';
import {
	LandfireVegetationCondition,
	LandfireFuelVegetationType,
} from '../core/getdata/rasterSources';

export const campaign = async (req, res) => {
	const { mapBounds, pixelBounds, latlng, zoom } = req.body;

	// Get DEM tiles for map bounds
	mapBounds && createDEM(mapBounds);
	if (latlng) {
		const topo = await getTopography(latlng);
		console.log(topo);
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

	// LANDFIRE VEGETATION CONDITION CLASS REQUEST ---------------------------------

	mapBounds &&
		LandfireFuelVegetationType.fetchImage(
			mapBounds.map((bounds) => refitBoundsToMapTiles(bounds))
		);

	latlng && LandfireFuelVegetationType.getPixelAt(latlng);

	res.send('good job ahole');
};
