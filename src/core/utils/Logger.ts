/*
 * Firestarter.io
 *
 * Copyright (C) 2022 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

import * as chalk from 'chalk';
import * as Winston from 'winston';
import { createLogger, format, info, transports } from 'winston';

const { printf, errors } = format;

enum Levels {
	info = 'info',
	header = 'header',
	success = 'success',
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
		success: 2,
		server: 3,
		warn: 4,
		error: 5,
	},
	colors: {
		info: 'green',
		header: 'bold black',
		success: 'green',
		server: 'blue',
		warn: 'yellowBG',
		error: 'red',
	},
};

const logger = createLogger({ levels: levels.levels });
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
				format((info) => {
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

export const emojis = {
	fetch: '🐕',
	successCheck: '✅',
	errorX: '❌',
	fire: '🔥',
	notepad: '🗒️',
	explode: '🤯',
};

interface F {
	(...args: any[]): any;
	emojis: typeof emojis;
}

export const log = <F>function (...args: any[]) {
	console.log(...args);
};

log.emojis = emojis;

export default logger;
