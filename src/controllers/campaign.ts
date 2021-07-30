/*
 * Firestarter.io
 *
 * Copyright (C) 2021 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

/**
 * Routes for /api/campaign
 */

// POST /api/campaign

import * as L from 'leaflet';
import { createDEM } from '@getdata/dem';
import Campaign from '@core/burncode/Campaign';

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
			camp = new Campaign(L.latLng(latlng), 1624950000000);
			await camp.initialize();
			// @ts-ignore
			global.camp = camp;
			globalThis.camp = camp;
			res.send(camp.simplify());
		} else {
			const thing = camp.extents[0].getPixelValuesAt(L.latLng(latlng));
			// console.log(thing);
			await camp.startFire(L.latLng(latlng));
			res.send(camp.simplify());
		}
	}
};
