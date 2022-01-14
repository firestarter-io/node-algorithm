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
 * Profiler utilities for measuring app performance
 */

import * as fs from 'fs';
import * as v8profiler from 'v8-profiler-next';
import { plot } from 'asciichart';
import logger from '@core/utils/Logger';

v8profiler.setGenerateType(1);

const simpleDateTitle = new Date()
	.toLocaleString()
	.replaceAll('/', '-')
	.replaceAll(',', '')
	.replace(' ', '-')
	.replace(' ', '')
	.replaceAll(':', '-');

interface ProfilerOptions {
	/**
	 * Title of the <title>.cpuprofile file that is output from the profiler
	 */
	title?: string;
	/**
	 * Path to the <title>.cpuprofile file
	 */
	outputDir?: string;
	/**
	 * Whether or not the profiler is active, typically determined by environment variable
	 */
	active: boolean;
}

/**
 * Utility class for creating a nodejs profiler.  Leverages [v8-profiler-next](https://github.com/hyj1991/v8-profiler-next)
 * to create a .cpuprofile file.  Can be woven into various areas of code to profile certain routes / activities.  Can also
 * be configured to only run when certain environment variables are true.
 * @example
 * const campaignProfiler = new Profiler({
 *  active: process.env.PROFILE_MODE // will only run if this env var is true
 * })
 * campaignProfiler.start() // start profiling
 * const campaign = new Campaign(args)
 * await campaign.initialize()
 * campaignProfiler.finish() // finish profiling and write to file
 */
export class Profiler {
	title: string;
	active: boolean;
	outputDir: string;

	constructor(options: ProfilerOptions) {
		this.active = options.active;
		this.title = options.title ?? simpleDateTitle;
		this.outputDir =
			options.outputDir ??
			process.env.OUTPUT_DIR ??
			`temp/profiles/${this.title}}`;
	}

	/**
	 * Begins profiling
	 */
	start() {
		if (this.active) {
			v8profiler.startProfiling(this.title, true);
		}
	}

	/**
	 * Completes profiling and writes results to .cpuprofile
	 */
	finish() {
		if (this.active) {
			const profile = v8profiler.stopProfiling(this.title);
			profile.export((error, result) => {
				if (error) {
					logger.log('error', 'Error creating performance profile');
					logger.log('error', error);
				} else {
					fs.writeFileSync(
						`${process.cwd()}/${this.outputDir}/${this.title}.cpuprofile`,
						result
					);
				}
			});
		}
	}
}

export default Profiler;

interface TimestepProfilerOptions extends ProfilerOptions {
	/**
	 * How often a Timestep's time-to-execute should be measured,
	 * i.e. spacing of 10 measures every 10 Timesteps,
	 * spacing of 100 measures every 100 Timesteps
	 */
	spacing?: number;
}

/**
 * The TimestepProfiler measured the time to execute each Timestep iteration.  It is designed to wrap
 * around the Timestep procedure.  It will measure the time to execute Timesteps at a given spacing,
 * and output an ascii graph the the given profile's output dir. Can also be configured to only
 * run when certain environment variables are true.
 */
export class TimestepProfiler {
	title: string;
	active: boolean;
	outputDir: string;
	spacing: number;
	times: number[] = [];
	timer;

	constructor(options: TimestepProfilerOptions) {
		this.active = options.active;
		this.title = options.title ?? simpleDateTitle;
		this.outputDir =
			options.outputDir ??
			process.env.OUTPUT_DIR ??
			`temp/profiles/${this.title}}`;
		this.spacing = options.spacing ?? 100;
	}

	start(index: number) {
		if (this.active && index % this.spacing === 0) {
			this.timer = process.hrtime();
		}
	}

	stop(index: number) {
		if (this.timer && index % this.spacing === 0) {
			const time = process.hrtime(this.timer);
			this.times.push(time[1] / 1_000_000);
			this.timer = undefined;
			return time;
		}
		return undefined;
	}

	export() {
		if (this.active) {
			const graph = plot(this.times, { height: 30 });
			fs.writeFileSync(`${this.outputDir}/Timestep Graph.txt`, graph);
		}
	}
}
