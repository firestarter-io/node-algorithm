import { Canvas, createCanvas, Image, loadImage } from 'canvas';
import { tiles } from './data';
import type { LatLngBounds, LatLngLiteral } from 'leaflet';
import * as xyz from 'xyz-affair';

/**
 * Map tile coordinate object
 */
interface TileCoord {
	x: number;
	y: number;
	z: number;
}

/**
 * Abridged map bounds object (just coordinates, no methods)
 */
interface MapBounds {
	_southWest: LatLngLiteral;
	_northEast: LatLngLiteral;
}

/**
 * Takes in tile coordinate and mapbox token, returns mapbox rgb terrain tile url
 * @param {Object} coords | Map tile coordinates
 * @param {String} token | Mapbox token
 */
const createMapboxRgbUrl = (coords: TileCoord, token: string): string => {
	const { x, y, z } = coords;
	return `https://api.mapbox.com/v4/mapbox.terrain-rgb/${z}/${y}/${x}.pngraw?access_token=${token}`;
};

/**
 * Takes in array of LatLngBounds objects and returns array of XYZ coordinate objects
 * for all maptiles in those bounds
 * @param {Array} latLngBoundsArray | Array of LatLngBounds objects
 * @param {Number} scale | Map zoom value for which you want to get tile coords
 */
function getTileCoords(
	latLngBoundsArray: MapBounds[],
	scale: number
): TileCoord[] {
	var allTileCoordsUnfiltered = [];
	const mod = Math.pow(2, scale);

	latLngBoundsArray.forEach((latlngBounds) => {
		const { _southWest, _northEast } = latlngBounds;

		const boundsAsArray = [
			[_southWest.lng, _southWest.lat],
			[_northEast.lng, _northEast.lat],
		];

		let tileCoords = xyz(boundsAsArray, scale);

		// correct for any negative coordinate values
		tileCoords = tileCoords.map((c) => ({
			x: ((c.x % mod) + mod) % mod,
			y: ((c.y % mod) + mod) % mod,
			z: c.z,
		}));

		allTileCoordsUnfiltered = [...allTileCoordsUnfiltered, ...tileCoords];
	});

	// filter duplicate values
	const filteredTileCoords = allTileCoordsUnfiltered.filter(
		(elem, index, self) =>
			self.findIndex((t) => {
				return t.x === elem.x && t.y === elem.y && t.z === elem.z;
			}) === index
	);

	return filteredTileCoords;
}

/**
 * Takes in an array of MapBounds and map zoom, finds all Mapbox RGB DEM tiles for those
 * parameters, fetches those tiles, transforms them into their raw RGBA data as Uint8ClampedArrays,
 * stores them in the tiles object
 *
 * TODO: store tile rgb data only for a given user session - wipe memory after that
 *
 * @param {Array} bounds | Array of MapBounds objects
 * @param {Number} scale | Zoom level of tiles
 */
export function createDEM(bounds: MapBounds[], scale: number = 12) {
	let tileCoords: any = getTileCoords(bounds, scale); // why any??

	tileCoords = tileCoords.filter((coord: TileCoord) => {
		const { x, y, z } = coord;
		const name = `X${x}Y${y}Z${z}`;
		if (Object.keys(tiles).includes(name)) {
			return false;
		} else {
			return true;
		}
	});

	// Don't try to fetch more than X number of tiles at a time!  Adjust input parameters instead
	if (tileCoords.length > 30) {
		console.log(
			'Map bounds and zoom comprised of over 20 tiles.  Consider smaller bounds or zoom.  Aborting tile fetching.'
		);
	} else {
		Promise.all<CanvasImageSource>(
			tileCoords.map((coord: TileCoord) => {
				const url = createMapboxRgbUrl(coord, process.env.MAPBOX_TOKEN);
				return loadImage(url);
			})
		)
			.then((images: CanvasImageSource[]): void => {
				console.log(images);
				images.forEach((image: CanvasImageSource, index: number) => {
					const canvas: Canvas = createCanvas(256, 256);
					const ctx: RenderingContext = canvas.getContext('2d');
					ctx.drawImage(image, 0, 0, 256, 256);
					const { x, y, z } = tileCoords[index];
					const name = `X${x}Y${y}Z${z}`;
					tiles[name] = ctx.getImageData(0, 0, 256, 256).data;
				});
			})
			.catch((e) => console.log(e));
	}
}
