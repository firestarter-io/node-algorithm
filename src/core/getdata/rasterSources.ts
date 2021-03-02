/**
 * Firestarter.io
 *
 * List of raster data sources
 */

import { EsriRasterDataSource } from '@utils/EsriRasterDataSource';
import {
	vegetationClassCache,
	groundcoverCache,
	fuelVegetationType,
} from '@data';

export const LandfireVegetationCondition = new EsriRasterDataSource({
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
// @ts-ignore
global.LandfireVegetationCondition = LandfireVegetationCondition;

export const LandfireFuelVegetationType = new EsriRasterDataSource({
	url:
		'https://landfire.cr.usgs.gov/arcgis/rest/services/Landfire/US_200/MapServer',
	exportType: 'export',
	f: 'image',
	format: 'png32',
	sr: '102100',
	sublayer: '25',
	dpi: '96',
	dataCache: fuelVegetationType,
});
// @ts-ignore
global.LandfireFuelVegetationType = LandfireFuelVegetationType;

export const GroundcoverRequest = new EsriRasterDataSource({
	url:
		'https://landscape6.arcgis.com/arcgis/rest/services/World_Land_Cover_30m_BaseVue_2013/ImageServer',
	dataCache: groundcoverCache,
});
