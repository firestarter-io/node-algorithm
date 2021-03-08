/**
 * Firestarter.io
 *
 * Convenience class to keep all logger logic centralized
 */

export class Logger {
	static log(...args: any[]) {
		console.log(...args);
	}

	static emojis = {
		fetch: '🐕',
		successCheck: '✅',
		errorX: '❌',
		fire: '🔥',
	};
}
