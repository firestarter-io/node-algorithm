/*
 * Firestarter.io
 *
 * Copyright (C) 2022 Blue Ohana, Inc.
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
 * If the server is currently running in develop mode
 */
export const DEVMODE = process.env.NODE_ENV === 'development';

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
export const PURGE_TILES = false;

/**
 * Whether or not we are running the server in profiler mode
 */
export const PROFILER = !!process.env.CAMPAIGN_PROFILER;

/**
 * Number of timesteps to run when running the profiler
 */
export const PROFILER_TIMESTEPS = process.env.PROFILER_TIMESTEPS
	? Number(process.env.PROFILER_TIMESTEPS)
	: undefined;

export default {
	PORT,
	DEVMODE,
	TEMP_DIR,
	TILE_DIR,
	LEGENDS_DIR,
	PROFILER,
	PROFILER_TIMESTEPS,
};
