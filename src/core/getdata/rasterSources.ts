/**
 * Firestarter.io
 *
 * List of raster data sources
 */

import { EsriRasterDataSource } from '../utils/esri-utils';
import { vegetationClassCache, groundcoverCache } from '../../data';

export const landfireVCCRequest = new EsriRasterDataSource({
	url:
		'https://landfire.cr.usgs.gov/arcgis/rest/services/Landfire/US_200/MapServer',
	exportType: 'export',
	f: 'image',
	format: 'png32',
	sr: '102100',
	sublayer: '30',
	dpi: '96',
	dataCache: vegetationClassCache,
});

export const groundcoverRequest = new EsriRasterDataSource({
	url:
		'https://landscape6.arcgis.com/arcgis/rest/services/World_Land_Cover_30m_BaseVue_2013/ImageServer',
	dataCache: groundcoverCache,
});
