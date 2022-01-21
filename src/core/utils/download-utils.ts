/*
 * Firestarter.io
 *
 * Copyright (C) 2022 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

/**
 * Utilities for downloading images and files
 */

import * as fs from 'fs';
import * as path from 'path';
import axios, { AxiosResponse } from 'axios';
import { TILE_DIR } from '@config';

/**
 * Function to create an image path to save image to, if none exists yet
 * @param filepath | path to image directory
 * @returns Promise
 */
const createDir = async (filepath: string): Promise<void> => {
	return new Promise(resolve => {
		if (fs.existsSync(filepath)) {
			resolve();
		} else {
			fs.mkdirSync(filepath, { recursive: true });
			resolve();
		}
	});
};

/**
 * Async function to download image
 * @param requestParameters | Request parameters
 */
export const downloadImage = async downloadInstructions => {
	const filepath = path.join(TILE_DIR, `/${downloadInstructions.tiledir}`);
	await createDir(filepath);
	const writer = fs.createWriteStream(
		`${filepath}/${downloadInstructions.tilename}.png`
	);
	const streamresponse = (await axios(downloadInstructions.body).catch(e =>
		console.error(e)
	)) as AxiosResponse;
	streamresponse.data.pipe(writer);
	return new Promise((resolve, reject) => {
		writer.on('finish', () => resolve('success'));
		writer.on('error', () => reject());
	});
};

/**
 * Async function to write JSON to file
 * @param json The JSON object to write to a file
 * @param filepath The path to the file to be written
 * @param filename The name of the file to be written, not including the .json extension
 */
export const downloadJSON = async (
	json: object,
	filepath: string,
	filename: string
) => {
	await createDir(filepath);
	fs.writeFileSync(`${filepath}/${filename}.json`, JSON.stringify(json));
};
