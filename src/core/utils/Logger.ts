/*
 * Firestarter.io
 *
 * Copyright (C) 2021 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

import { createLogger, format, transports } from 'winston';

const { printf } = format;

export const logger = createLogger({
	transports: [
		new transports.Console({
			format: format.combine(
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
		}),
	],
});

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
