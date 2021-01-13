/**
 * Firestarter.io
 *
 * Utility functions for working with Bounds and LatLngBounds
 * and arrays thereof
 */

import { latLngBounds } from 'leaflet';
import { MapBounds } from '../../../types/gis.types';

/**
 * Function that simplified arra
 * @param latLngBoundsArray | MapBounds array object
 */
export function simplifyBoundsArray(
	latLngBoundsArray: MapBounds[]
): MapBounds[] {
	let simplifiedBounds = [];
	let mergedBoundsIndices = [];
	latLngBoundsArray.forEach((bounds, ind) => {
		latLngBoundsArray.forEach((b, i) => {
			if (ind !== i) {
				let boundsWProto = latLngBounds(
					bounds._southWest,
					bounds._northEast
				);
				let bWProto = latLngBounds(b._southWest, b._northEast);
				let paddedBounds = boundsWProto.pad(0.25);
				let paddedB = bWProto.pad(0.25);

				if (paddedBounds.intersects(paddedB)) {
					const mergedBounds = boundsWProto.extend(bWProto);
					simplifiedBounds.push(mergedBounds);
					mergedBoundsIndices.push(ind);
					mergedBoundsIndices.push(i);
				}
			}
		});
	});
	mergedBoundsIndices.forEach((i) => {
		latLngBoundsArray.splice(i, 1);
	});
	latLngBoundsArray.push(...simplifiedBounds);
	return latLngBoundsArray;
}
