/**
 * Firestarter.io
 *
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

const emojis = {
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
