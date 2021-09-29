/*
 * Firestarter.io
 *
 * Copyright (C) 2021 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

import { resample } from './arrays';

class TestItem {
	time: number;
	index: number;
	constructor(time, index) {
		this.time = time;
		this.index = index;
	}

	description() {
		return `This is item ${this.index}`;
	}
}

const sample3 = [
	new TestItem(0, 0),
	new TestItem(7, 1),
	new TestItem(10, 2),
	new TestItem(22, 3),
];

describe('The resample function', () => {
	it('Should skip values when there are multiple entries within a sampling interval', () => {
		const sample0 = [
			{
				time: 0,
				details: 'Item 1',
			},
			{
				time: 7, // <------ should skip this
				details: 'Item 2',
			},
			{
				time: 8,
				details: 'Item 3',
			},
			{
				time: 12,
				details: 'Item 4',
			},
		];

		const resampled1 = resample(sample0, 'time', 10);

		expect(resampled1).toEqual([
			{
				time: 0,
				details: 'Item 1',
			},
			{
				time: 8,
				details: 'Item 3',
			},
			{
				time: 12,
				details: 'Item 4',
			},
		]);
	});

	it('Should skip values when there are multiple entries within a sampling interval', () => {
		const sample1 = [
			{
				time: 0,
				details: 'Item 1',
			},
			{
				time: 7, // <------ should skip this
				details: 'Item 2',
			},
			{
				time: 8,
				details: 'Item 3',
			},
			{
				time: 12,
				details: 'Item 4',
			},
		];

		const resampled1 = resample(sample1, 'time', 10, (item, sampleTime) => {
			item.time = sampleTime;
			return item;
		});

		expect(resampled1).toEqual([
			{
				time: 0,
				details: 'Item 1',
			},
			{
				time: 10,
				details: 'Item 3',
			},
			{
				time: 20,
				details: 'Item 4',
			},
		]);
	});

	it('Should repeat values when there are no entries between result entries', () => {
		const sample2 = [
			{
				time: 0,
				details: 'Item 1',
			},
			{
				time: 7,
				details: 'Item 2',
			},
			{
				time: 9, // <------ should repeat this
				details: 'Item 3',
			},
			{
				time: 22,
				details: 'Item 4',
			},
		];

		const resampled1 = resample(sample2, 'time', 10, (item, sampleTime) => {
			item.time = sampleTime;
			return item;
		});

		expect(resampled1).toEqual([
			{
				time: 0,
				details: 'Item 1',
			},
			{
				time: 10,
				details: 'Item 3',
			},
			{
				time: 20,
				details: 'Item 3',
			},
			{
				time: 30,
				details: 'Item 4',
			},
		]);
	});

	it('Should include values whos original sortkey land on the exact sampling interval', () => {
		const sample3 = [
			{
				time: 0,
				details: 'Item 1',
			},
			{
				time: 7,
				details: 'Item 2',
			},
			{
				time: 10, // <------ should include this
				details: 'Item 3',
			},
			{
				time: 22,
				details: 'Item 4',
			},
		];

		const resampled3 = resample(sample3, 'time', 10, (item, sampleTime) => {
			item.time = sampleTime;
			return item;
		});

		expect(resampled3).toEqual([
			{
				time: 0,
				details: 'Item 1',
			},
			{
				time: 10,
				details: 'Item 3',
			},
			{
				time: 20,
				details: 'Item 3',
			},
			{
				time: 30,
				details: 'Item 4',
			},
		]);
	});

	it('Should maintain prototypal inheritance of items passed', () => {
		const resampled2 = resample(sample3, 'time', 10, (item, sampleTime) => {
			item.time = sampleTime;
			return item;
		});

		expect(resampled2[0].description()).toBe('This is item 0');
	});
});
