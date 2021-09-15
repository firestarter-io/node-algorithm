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
 * List of raster data sources, excluding Digital Elevation Model
 */

import { DataGroups } from '@data';
import { EsriRasterDataSource } from '@utils/EsriRasterDataSource';

export const FBFuelModels13 = new EsriRasterDataSource({
	datagroup: DataGroups.FBFuelModels13,
	name: 'Anderson Fuel Models',
	url: 'https://landfire.cr.usgs.gov/arcgis/rest/services/Landfire/US_200/MapServer',
	exportType: 'export',
	f: 'image',
	format: 'png32',
	sr: '102100',
	sublayer: '19',
	dpi: '96',
});
