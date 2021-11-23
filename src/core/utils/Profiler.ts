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

const simpleDateTitle = new Date()
	.toLocaleString()
	.replaceAll('/', '-')
	.replaceAll(',', '')
	.replace(' ', '-')
	.replace(' ', '')
	.replaceAll(':', '-');

interface ProfilerOptions {
	title?: string;
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
	title: string = simpleDateTitle;
	active: boolean;

	constructor(options: ProfilerOptions) {
		const { title, active } = options;
		if (title) {
			this.title = title;
		}
		this.active = active;
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
						`${process.cwd()}/temp/profiles/${this.title}.cpuprofile`,
						result
					);
				}
			});
		}
	}
}

export default Profiler;
