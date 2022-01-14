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
import logger from '@core/utils/Logger';

v8profiler.setGenerateType(1);

export const simpleDateTitle = new Date()
	.toLocaleString()
	.replaceAll('/', '-')
	.replaceAll(',', '')
	.replace(' ', '-')
	.replace(' ', '')
	.replaceAll(':', '-');

export interface ProfilerOptions {
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
		this.outputDir = options.outputDir ?? process.env.OUTPUT_DIR;
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
