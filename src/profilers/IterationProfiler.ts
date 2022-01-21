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
import { plot, blue, green, cyan, magenta, red } from 'asciichart';
import { Instance as ChalkInstance, Chalk } from 'chalk';
import { ProfilerOptions, simpleDateTitle } from './CpuProfiler';

interface IterationProfilerOptions extends ProfilerOptions {
	/**
	 * How often a Timestep's time-to-execute should be measured,
	 * i.e. spacing of 10 measures every 10 Timesteps,
	 * spacing of 100 measures every 100 Timesteps
	 */
	spacing?: number;
	/**
	 * Whether or not to measure memory usage at the iterations
	 */
	memory?: boolean;
	/**
	 * Whether or not output files will be in .ansi format or .txt format
	 */
	coloredOutput?: boolean;
}

/**
 * The IterationProfiler measures the time to execute any iteration in a loop.  It is designed to wrap
 * around the the inner logic within any looping procedure.  It will measure the time to execute the
 * iteration at a given interval (every x iterations), and output an ascii graph to the output dir. Note
 * the output file may be a .ansi file, which can be nicely read in vscode by the ANSI Colors extension.
 * Can also be configured to only run when certain environment variables are true.
 */
export class IterationProfiler {
	title: string;
	active: boolean;
	outputDir: string;
	coloredOutput: boolean;
	spacing: number;
	times: number[] = [];
	timer: [number, number];
	memory: boolean;
	memoryRecordings: NodeJS.MemoryUsage[] = [];
	chalk: Chalk;

	/**
	 * The IterationProfiler measures the time to execute any iteration in a loop.  It is designed to wrap
	 * around the the inner logic within any looping procedure.  It will measure the time to execute the
	 * iteration at a given interval (every x iterations), and output an ascii graph to the output dir. Note
	 * the output file may be a .ansi file, which can be nicely read in vscode by the ANSI Colors extension.
	 * Can also be configured to only run when certain environment variables are true.
	 */
	constructor(options: IterationProfilerOptions) {
		this.active = options.active;
		this.title = options.title ?? simpleDateTitle;
		this.outputDir = options.outputDir ?? process.env.OUTPUT_DIR;
		this.coloredOutput = options.coloredOutput ?? true;
		this.spacing = options.spacing ?? 100;
		this.memory = options.memory ?? true;
		this.chalk = new ChalkInstance({ level: this.coloredOutput ? 2 : 0 });
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
	stop(index: number): [number, number] | undefined {
		if (this.timer && index % this.spacing === 0) {
			const time = process.hrtime(this.timer);
			this.times.push(time[1] / 1_000_000);
			this.timer = undefined;

			if (this.memory) {
				this.memoryRecordings.push(process.memoryUsage());
			}

			return time;
		}
		return undefined;
	}

	/**
	 * Exports the values recorded to an ascii plot text file
	 */
	export() {
		if (this.active) {
			const { outputDir, coloredOutput, chalk, memoryRecordings, times } = this;

			const filename =
				outputDir + '/graphs' + `${coloredOutput ? '.ansi' : '.txt'}`;

			const opening =
				chalk.bold('Performance Metrics for Firestarter\n\n') +
				`Recorded ${new Date().toLocaleString()}\n` +
				(coloredOutput
					? 'This file written with ANSI enabled, requires ANSI Colors extension to read\n'
					: '') +
				`\n\n` +
				chalk.underline('Timetsteps time-to-calculate:') +
				`\n\n`;

			fs.writeFileSync(filename, opening);

			const tsgraph = plot(times, {
				height: 30,
				colors: coloredOutput ? [blue] : undefined,
			});
			fs.appendFileSync(filename, tsgraph);

			if (memoryRecordings?.length) {
				const memgraph = plot(
					[
						memoryRecordings.map((usage) => usage.heapTotal),
						memoryRecordings.map((usage) => usage.heapUsed),
						memoryRecordings.map((usage) => usage.arrayBuffers),
						memoryRecordings.map((usage) => usage.external),
						memoryRecordings.map((usage) => usage.rss),
					],
					{
						height: 30,
						colors: coloredOutput
							? [blue, green, cyan, magenta, red]
							: undefined,
					}
				);

				fs.appendFileSync(
					filename,
					`\n\n\n\n\n\n${chalk.underline('Memory Usage:')}\n\n`
				);
				fs.appendFileSync(filename, memgraph);
				fs.appendFileSync(filename, '\n\n');

				if (coloredOutput) {
					fs.appendFileSync(
						filename,
						`heapTotal     ${chalk.bold.blue('────────────────\n')}`
					);
					fs.appendFileSync(
						filename,
						`heapUsed      ${chalk.bold.green('────────────────\n')}`
					);
					fs.appendFileSync(
						filename,
						`arrayBuffers  ${chalk.bold.cyan('────────────────\n')}`
					);
					fs.appendFileSync(
						filename,
						`external      ${chalk.bold.magenta('────────────────\n')}`
					);
					fs.appendFileSync(
						filename,
						`rss           ${chalk.bold.red('────────────────\n')}`
					);
				}
			}
		}
	}
}
