/*
 * Firestarter.io
 *
 * Copyright (C) 2021 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

import * as path from 'path';

/**
 * The port that the server runs on
 */
export const PORT = '9090';

/**
 * The directory to use when generating temporary files / ephemeral data on the server's memory
 */
export const TEMP_DIR = path.relative(process.cwd(), 'temp');

/**
 * The directory to use when saving in-memory tile images
 */
export const TILE_DIR = path.join(TEMP_DIR, 'tileimages');

/**
 * The directory to use when saving in-memory legend JSON
 */
export const LEGENDS_DIR = path.join(TEMP_DIR, 'legends');

/**
 * Whether or not to purge tiles on server restart
 */
export const purgeTilesOnRestart = false;

export default {
	PORT,
	TEMP_DIR,
	TILE_DIR,
	LEGENDS_DIR,
};