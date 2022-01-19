/*
 * Firestarter.io
 *
 * Copyright (C) 2022 Blue Ohana, Inc.
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
import { Response } from 'express';
import { createDEM } from '@getdata/dem';
import Campaign from '@core/burncode/Campaign';
import logger from '@core/utils/Logger';
import { CpuProfiler } from 'profilers/CpuProfiler';
import { PROFILER } from '@config';
import { tsprofiler } from '@core/burncode/Timestep';

const profiler = new CpuProfiler({
	active: PROFILER,
});

let camp: Campaign;

export const campaign = async (req, res: Response) => {
	const { mapBounds } = req.body;
	const latlng: L.LatLngLiteral = req.body.latlng;

	// Get DEM tiles for map bounds
	mapBounds &&
		createDEM(L.latLngBounds(mapBounds._southWest, mapBounds._northEast));
	if (latlng) {
		if (!camp) {
			profiler.start();

			camp = new Campaign(L.latLng(latlng), 1624950000000);
			await camp.initialize();

			// Adding to global scope for quick value checking and debugging:
			// @ts-ignore
			globalThis.camp = camp;

			res.on('finish', () => {
				process.stdout.write('\n');
				logger.log('server', '📤 Sent campaign response');
				profiler.finish();
				tsprofiler.export();
			});

			res.send(camp.toJSON());
		} else {
			const values = camp.extents[0].getPixelValuesAt(L.latLng(latlng));
			// console.log(values);
			await camp.startFire(L.latLng(latlng));
			res.send(camp.toJSON());
		}
	}
};
