/**
 * Firestarter.io
 *
 * Code to get all required data to run model
 */

import { MapBounds } from '../../types/gis.types';
import { EsriImageRequest } from '../utils/esri-utils';
import { createDEM } from './createDEM';

export async function getData(latLngBoundsArray: MapBounds[]) {
	/**
	 * Promise to get DEM data
	 */
	const DEMpromise = createDEM(latLngBoundsArray);

	/**
	 * Promise to get groundcover image data
	 */
	const groundcoverRequest = new EsriImageRequest(
		'https://landscape6.arcgis.com/arcgis/rest/services/World_Land_Cover_30m_BaseVue_2013/ImageServer'
	);
}
