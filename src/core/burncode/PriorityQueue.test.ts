/*
 * Firestarter.io
 *
 * Copyright (C) 2021 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

import Cell from './Cell';
import PriorityQueue from './PriorityQueue';

describe('The PriorityQueue.queue method', () => {
	const queue = new PriorityQueue();

	it('Initializes an empty queue', () => {
		expect(queue.items).toHaveLength(0);
	});

	it('Adds an item to the queue', () => {
		queue.enqueue({
			time: 1,
			origin: 1,
			setToBurnedOut: {
				id1: 'cell1' as unknown as Cell,
			},
		});

		expect(queue.items).toHaveLength(1);
		expect(queue.items[0].time).toEqual(1);
	});

	it('Adds a second item to the queue in the correct place', () => {
		queue.enqueue({
			time: 10,
			origin: 1,
		});

		expect(queue.items).toHaveLength(2);
		expect(queue.items[1].time).toEqual(10);
	});

	it('Adds a intermediate item to the queue in the correct place', () => {
		queue.enqueue({
			time: 5,
			origin: 1,
			setToBurnedOut: {
				id2: 'cell2' as unknown as Cell,
			},
		});

		expect(queue.items).toHaveLength(3);
		expect(queue.items[1].time).toEqual(5);
	});

	it('Merges 2 queue items with the same time stamp', () => {
		queue.enqueue({
			time: 5,
			origin: 1,
			setToBurnedOut: {
				id3: 'cell3' as unknown as Cell,
			},
		});

		expect(queue.items[1].setToBurnedOut).toEqual({
			id2: 'cell2',
			id3: 'cell3',
		});
	});

	it('Removes a Cell from later in the queue if that Cell is added earlier', () => {
		queue.clear();

		queue.enqueue({
			time: 5,
			origin: 1,
			setToBurning: {
				id4: { id: 'id4' } as unknown as Cell,
				id5: { id: 'id5' } as unknown as Cell,
			},
		});

		queue.enqueue({
			time: 2,
			origin: 1,
			setToBurning: {
				id4: { id: 'id4' } as unknown as Cell,
			},
		});

		expect(queue.items).toEqual([
			{
				time: 2,
				origin: 1,
				setToBurning: {
					id4: { id: 'id4' } as unknown as Cell,
				},
			},
			{
				time: 5,
				origin: 1,
				setToBurning: {
					id5: { id: 'id5' } as unknown as Cell,
				},
			},
		]);
	});
});
