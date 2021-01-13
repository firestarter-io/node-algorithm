/**
 * Firestarter.io
 *
 * Utility functions for getting RGB DEM tile images
 * and converting them to raw rgba pixel data
 */

import { Canvas, createCanvas, loadImage } from 'canvas';
import * as xyz from 'xyz-affair';

import { saveTile, tileCache, scale } from '../../config';
import { TileCoord, MapBounds, PointLiteral } from '../../types/gis.types';

/**
 * Takes in tile coordinate and mapbox token, returns mapbox rgb terrain tile url
 * @param {Object} coords | Map tile coordinates
 * @param {String} token | Mapbox token
 */
const createMapboxRgbUrl = (coord: TileCoord, token: string): string => {
	const { X, Y, Z } = coord;
	return `https://api.mapbox.com/v4/mapbox.terrain-rgb/${Z}/${X}/${Y}.pngraw?access_token=${token}`;
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

	return filteredTileCoords.map((c) => ({ X: c.x, Y: c.y, Z: c.z }));
}

/**
 * Take in a projection point and return the tile coordinates { X, Y, Z } of that point
 * @param {PointLiteral} point
 */
export function getTileCoord(point: PointLiteral): TileCoord {
	const mod = Math.pow(2, scale);

	const raw = {
		X: Math.floor(point.x / 256),
		Y: Math.floor(point.y / 256),
		Z: scale,
	};
	return {
		X: ((raw.X % mod) + mod) % mod,
		Y: ((raw.Y % mod) + mod) % mod,
		Z: raw.Z,
	};
}

/**
 * Fetch a single rgb tile and save rgb data to cache
 * @param {TileCoord} tileCoord | Maptile coordinate
 */
export async function fetchDEMTile(coord: TileCoord): Promise<void> {
	const { X, Y, Z } = coord;
	const name = `${Z}/${X}/${Y}`;

	if (!tileCache[name]) {
		const url: string = createMapboxRgbUrl(coord, process.env.MAPBOX_TOKEN);

		try {
			const image: any = await loadImage(url);
			const canvas: Canvas = createCanvas(256, 256);
			const ctx: RenderingContext = canvas.getContext('2d');
			ctx.drawImage(image, 0, 0, 256, 256);
			saveTile(name, ctx.getImageData(0, 0, 256, 256));
			console.log(`tile ${name} saved succesfully`);
		} catch (e) {
			console.log(e);
		}
	}
}

/**
 * Takes in an array of MapBounds and map zoom, finds all Mapbox RGB DEM tiles for those
 * parameters, fetches those tiles, transforms them into their raw RGBA data as Uint8ClampedArrays,
 * stores them in the tiles cache
 *
 * TODO: store tile rgb data only for a given user session - wipe memory after that
 *
 * @param {Array} latLngBoundsArray | Array of MapBounds objects
 * @param {Number} scale | Zoom level of tiles
 */
export async function createDEM(
	latLngBoundsArray: MapBounds[],
	scale: number = 12
) {
	let tileCoords: any = getTileCoords(latLngBoundsArray, scale); // why any??

	tileCoords = tileCoords.filter((coord: TileCoord) => {
		const { X, Y, Z } = coord;
		const name = `${Z}/${X}/${Y}`;
		if (Object.keys(tileCache).includes(name)) {
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
		await Promise.all<CanvasImageSource>(
			tileCoords.map((coord: TileCoord) => {
				const url = createMapboxRgbUrl(coord, process.env.MAPBOX_TOKEN);
				return loadImage(url);
			})
		)
			.then((images: CanvasImageSource[]): void => {
				images.forEach((image: CanvasImageSource, index: number) => {
					const canvas: Canvas = createCanvas(256, 256);
					const ctx: RenderingContext = canvas.getContext('2d');
					ctx.drawImage(image, 0, 0, 256, 256);
					const { X, Y, Z } = tileCoords[index];
					const name = `${Z}/${X}/${Y}`;
					saveTile(name, ctx.getImageData(0, 0, 256, 256));
				});
			})
			.then(() =>
				console.log(
					'DEM Tiles Succesfully retrieved, decoded, and saved to tileCache'
				)
			)
			// .then(() => console.log(tileCache))
			.catch((e) => console.log(e));
	}
}