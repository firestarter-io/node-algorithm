/**
 * Firestarter.io
 *
 * Code to get all required data to run model
 */

import {
	GroundcoverRequest,
	LandfireVegetationCondition,
	LandfireFuelVegetationType,
} from './rasterSources';
import { createDEM } from './dem';
import { MapBounds } from '../../types/gis';

export async function getData(latLngBoundsArray: MapBounds[]) {
	/**
	 * Promise to get DEM data
	 */
	await createDEM(latLngBoundsArray);

	/**
	 * Promise to get LANDFIRE vegetation coverage raster data
	 */
	await LandfireVegetationCondition.fetchImage(latLngBoundsArray);

	/**
	 * Promise to get LANDFIRE fuel vegetation type raster data
	 */
	await LandfireFuelVegetationType.fetchImage(latLngBoundsArray);
}
