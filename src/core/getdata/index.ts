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
import { MapBounds } from 'typings/gis';

export async function getData(latLngBounds: L.LatLngBounds) {
	/**
	 * Promise to get DEM data
	 */
	await createDEM(latLngBounds);

	/**
	 * Promise to get LANDFIRE vegetation coverage raster data
	 */
	await LandfireVegetationCondition.fetchImage(latLngBounds);

	/**
	 * Promise to get LANDFIRE fuel vegetation type raster data
	 */
	await LandfireFuelVegetationType.fetchImage(latLngBounds);
}
