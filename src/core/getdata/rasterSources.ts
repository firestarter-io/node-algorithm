/**
 * Firestarter.io
 *
 * List of raster data sources
 */

import { DataGroups, tileCache } from '@data';
import { EsriRasterDataSource } from '@utils/EsriRasterDataSource';

// export const FBFuelModels13 = new EsriRasterDataSource({
// 	datagroup: DataGroups.FBFuelModels13,
// 	url:
// 		'https://landfire.cr.usgs.gov/arcgis/rest/services/Landfire/US_200/MapServer',
// 	exportType: 'export',
// 	f: 'image',
// 	format: 'png32',
// 	sr: '102100',
// 	sublayer: '21',
// 	dpi: '96',
// 	dataCache: tileCache.FBFuelModels13,
// });

// Temporary replacement while LANDFIRE servers are down - causing ECONNRESET errors though:
export const FBFuelModels13 = new EsriRasterDataSource({
	datagroup: DataGroups.FBFuelModels13,
	url:
		'https://apps.fs.usda.gov/fsgisx01/rest/services/RDW_Landfire/US_13AndersonFBFM_v200/ImageServer',
	format: 'png32',
	dataCache: tileCache.FBFuelModels13,
});
// @ts-ignore
global.FBFuelModels13 = FBFuelModels13;

export const LandfireFuelVegetationType = new EsriRasterDataSource({
	datagroup: DataGroups.LandfireFuelVegetationType,
	url:
		'https://landfire.cr.usgs.gov/arcgis/rest/services/Landfire/US_200/MapServer',
	exportType: 'export',
	f: 'image',
	format: 'png32',
	sr: '102100',
	sublayer: '25',
	dpi: '96',
	dataCache: tileCache.LandfireFuelVegetationType,
});
// @ts-ignore
global.LandfireFuelVegetationType = LandfireFuelVegetationType;

export const GroundcoverRequest = new EsriRasterDataSource({
	datagroup: DataGroups.GroundCover,
	url:
		'https://landscape6.arcgis.com/arcgis/rest/services/World_Land_Cover_30m_BaseVue_2013/ImageServer',
	dataCache: tileCache.GroundCover,
});
