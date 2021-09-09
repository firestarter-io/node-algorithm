/*
 * Firestarter.io
 *
 * Copyright (C) 2021 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

import * as lodash from 'lodash';
import Cell from './Cell';

export interface EventQueueItem {
	/**
	 * The timestamp of the event in the priority queue, also acts as the priority itself
	 */
	time: number;
	/**
	 * The Cells to set to burning at the time of this event, if any
	 */
	setToBurning?: {
		[key: string]: Cell;
	};
	/**
	 * The Cells to set to burned out at the time of this event, if any
	 */
	setToBurnedOut?: {
		[key: string]: Cell;
	};
	/**
	 * The time of the EventQueueItem / TimeStamp that spawned the new item, helpful for tracing
	 * events backwards.  time and origin should only be the same for the very first event item
	 */
	origin: number;
}

/**
 * [Priority queue](https://en.wikipedia.org/wiki/Priority_queue) class customized for
 * FireStarter.
 *
 * Adapted from ["Implementation ofPriority Queue in Javascript"](https://www.geeksforgeeks.org/implementation-priority-queue-javascript/)
 */
class PriorityQueue {
	/**
	 * The items in the queue, should not be accessed directly
	 */
	private items: EventQueueItem[];
	/**
	 * Items that have been processed and removed from the queue, helpful for debugging
	 */
	private history: EventQueueItem[];
	/**
	 * A javascript Map which lists all Cells currently in the queue to be burned, and at what time.
	 * Needed for getting reference to queue item from Cell id
	 */
	private touchedCells: Map<string, number>;

	constructor() {
		this.items = [];
		this.history = [];
		this.touchedCells = new Map();
	}

	/**
	 * Adds an item to the priority queue in the correct place, based on the item's timestamp
	 * @param element | A QueueItem object
	 */
	enqueue(element: EventQueueItem) {
		/**
		 * Whether or not the new element is going to be added to the end of the queue
		 */
		var last = true;

		/**
		 * The index of the element that already exists in the queue with the same priority as the new element, if it exists
		 */
		const preexistingItemIndex = this.items.findIndex(
			(item) => item.time === element.time
		);

		/**
		 * If item already exists in the queue with this time/priority, merge new element
		 * into existing one
		 */
		if (preexistingItemIndex !== -1) {
			const preexistingItem: EventQueueItem = {
				...this.items[preexistingItemIndex],
			};
			this.items[preexistingItemIndex] = lodash.merge(preexistingItem, element);
		}

		/**
		 * Loop through existing item and add new element at appropriate place
		 */
		for (let i = 0; i < this.items.length; i++) {
			if (this.items[i].time > element.time) {
				this.items.splice(i, 0, element);
				last = false;
				break;
			}
		}

		/**
		 * If the item was not inserted somewhere by the for loop, it will be last, and should be pushed into the array
		 */
		if (last) {
			this.items.push(element);
		}

		/**
		 * Add all cells to burn in element to the touchedCells
		 */
		if (element.setToBurning) {
			new Map(Object.entries(element.setToBurning)).forEach((cell) => {
				this.touchedCells.set(cell.id, element.time);
			});
		}
	}

	/**
	 * Gets the next item in the priority queue and removes it from the queue
	 * @returns QueueItem
	 */
	next() {
		const nextItem = this.items.shift();
		this.history.push(nextItem);
		return nextItem;
	}

	/**
	 * Function to check whether or not a cell has already been calculated in the simulation
	 * @param cellId | The ID of the Cell you want to check
	 */
	cellTouched(cellId: string) {
		return this.touchedCells.get(cellId);
	}

	/**
	 * Returns the queue item that has a given time value
	 * @param time | The timestamp of the queue item to retrieve
	 */
	getItem(time: number) {
		return this.items.find((item) => item.time === time);
	}

	/**
	 * Checks whether an event queue item is empty, meaning it has no information
	 * in it other than a time
	 * @param item
	 */
	isItemEmpty(item: EventQueueItem) {
		const noSetToBurningCells = !item.setToBurning || !!item.setToBurning.size;
		const noSetToBurnedOutCell =
			!item.setToBurnedOut || !!item.setToBurnedOut.size;
	}

	/**
	 * Returns true if the queue is empty
	 * @returns boolean
	 */
	isEmpty(): boolean {
		return this.items.length === 0;
	}
}

export default PriorityQueue;
