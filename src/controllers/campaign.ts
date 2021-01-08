// POST /api/campaign

import * as L from 'leaflet';
import { createDEM } from '../core/getdata/createDEM';
import { getTopography } from '../core/getData/getTopography';

export const campaign = async (req, res) => {
	const { mapBounds, latlng, zoom } = req.body;

	// Get DEM tiles for map bounds
	mapBounds && createDEM(mapBounds);
	const topo = await getTopography(latlng);
	latlng && console.log(new L.LatLng(latlng.lat, latlng.lng));
	latlng && zoom && console.log(topo);

	// Pseudocode for new campaign logic flow
	// process req.body
	// .then(preload all data for initial bounds)
	// .then(calculate fire spread step by step)
	// .then(return response to client)

	res.send('good job ahole');
};
