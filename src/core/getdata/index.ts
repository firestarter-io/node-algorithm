/**
 * Firestarter.io
 *
 * Code to get all required data to run model
 */

import { groundcoverRequest, landfireVCCRequest } from './rasterSources';
import { createDEM } from './createDEM';
import { MapBounds } from '../../types/gis.types';

export async function getData(latLngBoundsArray: MapBounds[]) {
	/**
	 * Promise to get DEM data
	 */
	const DEMpromise = createDEM(latLngBoundsArray);

	/**
	 * Promise to get LANDFIRE vegetation coverage raster data
	 */
	const LFVCCpromise = landfireVCCRequest.fetchImage(latLngBoundsArray);
}
