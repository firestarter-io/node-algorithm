/*
 * Firestarter.io
 *
 * Copyright (C) 2022 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

import * as fs from 'fs';
import { plot } from 'asciichart';
import { ProfilerOptions, simpleDateTitle } from './Profiler';

interface IterationProfilerOptions extends ProfilerOptions {
	/**
	 * How often a Timestep's time-to-execute should be measured,
	 * i.e. spacing of 10 measures every 10 Timesteps,
	 * spacing of 100 measures every 100 Timesteps
	 */
	spacing?: number;
}

/**
 * The IterationProfiler measures the time to execute any iteration in a loop.  It is designed to wrap
 * around the the inner logic within any looping procedure.  It will measure the time to execute the
 * iteration at a given spacing, and output an ascii graph the the given profile's output dir. Can also
 * be configured to only run when certain environment variables are true.
 */
export class IterationProfiler {
	title: string;
	active: boolean;
	outputDir: string;
	spacing: number;
	times: number[] = [];
	timer: [number, number];

	/**
	 * The IterationProfiler measures the time to execute any iteration in a loop.  It is designed to wrap
	 * around the the inner logic within any looping procedure.  It will measure the time to execute the
	 * iteration at a given spacing, and output an ascii graph the the given profile's output dir. Can also
	 * be configured to only run when certain environment variables are true.
	 */
	constructor(options: IterationProfilerOptions) {
		this.active = options.active;
		this.title = options.title ?? simpleDateTitle;
		this.outputDir = options.outputDir ?? process.env.OUTPUT_DIR;
		this.spacing = options.spacing ?? 100;
	}

	/**
	 * Starts the clock to measure the time taken to execute an iteration
	 */
	start(index: number) {
		if (this.active && index % this.spacing === 0) {
			this.timer = process.hrtime();
		}
	}

	/**
	 * Stops the clock and records the time taken to execute an iteration
	 */
	stop(index: number) {
		if (this.timer && index % this.spacing === 0) {
			const time = process.hrtime(this.timer);
			this.times.push(time[1] / 1_000_000);
			this.timer = undefined;
			return time;
		}
		return undefined;
	}

	/**
	 * Exports the values recorded to an ascii plot text file
	 */
	export() {
		if (this.active) {
			const graph = plot(this.times, { height: 30 });
			fs.writeFileSync(`${this.outputDir}/Timestep Graph.txt`, graph);
		}
	}
}
