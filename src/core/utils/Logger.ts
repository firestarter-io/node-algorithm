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
 * Convenience class to keep all logger logic centralized
 */

// export class Logger {
// 	static log(...args: any[]) {
// 		console.log(...args);
// 	}

// 	static emojis = {
// 		fetch: '🐕',
// 		successCheck: '✅',
// 		errorX: '❌',
// 		fire: '🔥',
// 	};
// }

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
