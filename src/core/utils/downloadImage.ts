/**
 * Firestarter.io
 *
 * Utility for downloading images
 */

import * as fs from 'fs';
import * as path from 'path';
import axios, { AxiosResponse } from 'axios';

/**
 * Function to create an image path to save image to, if none exists yet
 * @param filepath | path to image directory
 * @returns Promise
 */
const createDir = async (filepath: string): Promise<void> => {
	return new Promise((resolve, reject) => {
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
export const downloadImage = async (downloadInstructions) => {
	const filepath = path.resolve(
		__dirname,
		`../../tileimages/${downloadInstructions.tiledir}`
	);
	await createDir(filepath);
	const writer = fs.createWriteStream(
		`${filepath}/${downloadInstructions.tilename}.png`
	);
	const streamresponse = (await axios(downloadInstructions.body).catch((e) =>
		console.error(e)
	)) as AxiosResponse;
	streamresponse.data.pipe(writer);
	return new Promise((resolve, reject) => {
		writer.on('finish', () => resolve('success'));
		writer.on('error', () => reject());
	});
};
