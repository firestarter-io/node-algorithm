/*
 * Firestarter.io
 *
 * Copyright (C) 2022 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

import * as Winston from 'winston';
import { createLogger, format, transports } from 'winston';
import { PROFILER } from '~config';

const { printf, errors } = format;

enum Levels {
	info = 'info',
	header = 'header',
	verbose = 'verbose',
	server = 'server',
	warn = 'warn',
	error = 'error',
}

const levels: {
	levels: { [key in Levels]: number };
	colors: { [key in Levels]: string };
} = {
	levels: {
		info: 0,
		header: 1,
		verbose: 2,
		server: 3,
		warn: 4,
		error: 5,
	},
	colors: {
		info: 'green',
		header: 'bold black',
		verbose: 'green',
		server: 'blue',
		warn: 'yellowBG',
		error: 'red',
	},
};

/**
 * Logger for firestarter, built on top of Winston
 */
const logger = createLogger({ levels: levels.levels }) as Winston.Logger &
	Record<keyof typeof levels['levels'], Winston.LeveledLogMethod>;

Winston.addColors(levels.colors);

/**
 * Override the winston console transport to support node --inspect, nodemon --inspect
 * Because winston will use stdout, stderror with higher priority than console.log
 * Taken from https://github.com/winstonjs/winston/issues/981#issuecomment-578417506
 */
function supportNodeInspect(winstonTransportsConsoleInstance) {
	// Override log fn to support log to node --inspect
	winstonTransportsConsoleInstance.log = (info, callback) => {
		const { level, message } = info;
		console.log(level, message);

		callback();
	};

	return winstonTransportsConsoleInstance;
}

logger.add(
	supportNodeInspect(
		new transports.Console({
			level: 'error',
			format: format.combine(
				errors({ stack: true }),
				format(info => {
					info.level = info.level.toUpperCase();
					return info;
				})(),
				format.colorize(),
				format.align(),
				printf(({ level, message }) => {
					return `${level} ${message}`;
				})
			),
		})
	)
);

if (PROFILER) {
	logger.add(
		new transports.File({
			filename: 'logfile.log',
			dirname: process.env.OUTPUT_DIR,
			level: 'error',
			format: format.combine(
				errors({ stack: true }),
				format(info => {
					info.level = info.level.toUpperCase();
					return info;
				})(),
				format.align(),
				printf(({ level, message }) => {
					return `${level} ${message}`;
				})
			),
		})
	);
}

export const emojis = {
	fetch: '🐕',
	successCheck: '✅',
	errorX: '❌',
	fire: '🔥',
	notepad: '🗒️',
	explode: '🤯',
};

export default logger;
