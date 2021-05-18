/**
 * Firestarter.io
 *
 * List of raster data sources
 */

import { DataGroups, tileCache } from '@data';
import { EsriRasterDataSource } from '@utils/EsriRasterDataSource';

export const FBFuelModels13 = new EsriRasterDataSource({
	datagroup: DataGroups.FBFuelModels13,
	name: 'Anderson Fuel Models',
	url: 'https://landfire.cr.usgs.gov/arcgis/rest/services/Landfire/US_200/MapServer',
	exportType: 'export',
	f: 'image',
	format: 'png32',
	sr: '102100',
	sublayer: '21',
	dpi: '96',
	dataCache: tileCache.FBFuelModels13,
});

export const GroundcoverRequest = new EsriRasterDataSource({
	datagroup: DataGroups.GroundCover,
	name: 'ESRI Ground Cover',
	url: 'https://landscape6.arcgis.com/arcgis/rest/services/World_Land_Cover_30m_BaseVue_2013/ImageServer',
	dataCache: tileCache.GroundCover,
});
