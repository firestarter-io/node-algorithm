/**
 * Firestarter.io
 *
 * List of raster data sources
 */

import { EsriImageRequest } from '../utils/esri-utils';

export const landfireVCCRequest = new EsriImageRequest({
	url:
		'https://landfire.cr.usgs.gov/arcgis/rest/services/Landfire/US_200/MapServer',
	exportType: 'export',
	f: 'image',
	format: 'png32',
	sr: '102100',
	sublayer: '30',
	dpi: '96',
});

export const groundcoverRequest = new EsriImageRequest({
	url:
		'https://landscape6.arcgis.com/arcgis/rest/services/World_Land_Cover_30m_BaseVue_2013/ImageServer',
});
