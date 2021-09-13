/*
 * Firestarter.io
 *
 * Copyright (C) 2021 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

/**
 * Utility functions for getting RGB DEM tile images
 * and converting them to raw rgba pixel data
 */

import * as path from 'path';
import * as fs from 'fs';
import { Canvas, createCanvas, loadImage } from 'canvas';
import { getTileCoords } from '@utils/geometry/Bounds';
import { saveTile, scale } from '@config';
import { TileCoord, PointLiteral } from 'typings/gis';
import { DataGroups, tileCache } from '@data';
import { downloadImage } from '@core/utils/download-utils';

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
	const tilename = `${Z}.${X}.${Y}`;

	const url: string = createMapboxRgbUrl(coord, process.env.MAPBOX_TOKEN);

	const filepath = path.resolve(
		__dirname,
		`../../tileimages/DEM/${tilename}.png`
	);

	/**
	 * Whether or not the tile image was already saved to local disc
	 */
	const tileInLocalFs = fs.existsSync(filepath);

	/**
	 * If tile image not yet in local disc, download it
	 */
	if (!tileInLocalFs) {
		console.log('here');
		const downloadInstructions = {
			tilename,
			tiledir: 'DEM',
			body: {
				url,
				responseType: 'stream',
			},
		};

		await downloadImage(downloadInstructions);
	}

	/**
	 * If tile image data not already in ephemeral memory, decode from local downloaded image and save
	 * imagedata to memory
	 */
	if (!tileCache.DEM[tilename]) {
		const localUrl = path.resolve(
			__dirname,
			`../../tileimages/DEM/${tilename}.png`
		);

		try {
			const image: any = await loadImage(localUrl);
			const canvas: Canvas = createCanvas(256, 256);
			const ctx: RenderingContext = canvas.getContext('2d');
			ctx.drawImage(image, 0, 0, 256, 256);
			saveTile(DataGroups.DEM, tilename, ctx.getImageData(0, 0, 256, 256));
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
	latLngBounds: L.LatLngBounds,
	scale: number = 12
) {
	let tileCoords: any = getTileCoords(latLngBounds, scale);

	tileCoords = tileCoords.filter((coord: TileCoord) => {
		const { X, Y, Z } = coord;
		const name = `${Z}.${X}.${Y}`;
		if (Object.keys(tileCache.DEM).includes(name)) {
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
		await Promise.all<void>(
			tileCoords.map((coord: TileCoord) => {
				fetchDEMTile(coord);
			})
		)
			// .then(() => console.log('Dem tiles loaded and saved to cache'))
			.catch((e) => console.log(e));
	}
}
