import * as canvas from 'canvas';
import { tiles } from './data';
import type { LatLngLiteral } from 'leaflet';
import * as xyz from 'xyz-affair';

interface MapBounds {
	_southWest: LatLngLiteral;
	_northEast: LatLngLiteral;
}

export function createDEM(bounds: MapBounds) {
	console.log(bounds);
	const { _southWest, _northEast } = bounds;
	const tileCoords = xyz(
		[
			[_southWest.lng, _southWest.lat],
			[_northEast.lng, _northEast.lat],
		],
		12
	);
	console.log(tileCoords);
}
