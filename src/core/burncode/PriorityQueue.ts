/*
 * Firestarter.io
 *
 * Copyright (C) 2021 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

import { DEVMODE } from '@config';
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
		/**
		 * Key is Cell.id string value
		 */
		[key: string]: Cell;
	};
	/**
	 * The Cells to set to burned out at the time of this event, if any
	 */
	setToBurnedOut?: {
		/**
		 * Key is Cell.id string value
		 */
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
 * Adapted from ["Implementation of Priority Queue in Javascript"](https://www.geeksforgeeks.org/implementation-priority-queue-javascript/)
 *
 * ***&#128211; &nbsp; See more in the [PriorityQueue Documentation](https://firestarter-io.github.io/node-algorithm/components/queue/queue/)***
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
		} else {
			/**
			 * If there is not already an existing queue item with this time/priority, add a new one
			 */

			/**
			 *
			 * Loop through list and add new element at appropriate place
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
		}

		/**
		 * Add all cells to burn in element to the touchedCells
		 */
		if (element.setToBurning) {
			new Map(Object.entries(element.setToBurning)).forEach((cell) => {
				/**
				 * If the Cell time to ignite has been calculated before in a previous step,
				 * but in this iteration, the calculated time is less, move that Cell's time
				 * to ignire to earlier in the queue
				 */
				if (element.time < this.touchedCells.get(cell.id)) {
					this.removeCell(cell, this.touchedCells.get(cell.id));
				}

				this.touchedCells.set(cell.id, element.time);
			});
		}
	}

	/**
	 * Removes an item from the queue
	 * @param time | The timestamp of the event item
	 */
	dequeue(time: number) {
		const itemIndex = this.items.findIndex((item) => item.time === time);
		if (itemIndex > -1) {
			this.items.splice(itemIndex, 1);
		}
	}

	/**
	 * Gets the next item in the priority queue and removes it from the queue
	 * @returns QueueItem
	 */
	next() {
		const nextItem = this.items.shift();
		if (DEVMODE) this.history.push(nextItem);
		return nextItem;
	}

	/**
	 * Returns the next item in the priority queue without removing it, if one exists
	 */
	peek() {
		return this.items[0];
	}

	/**
	 * Removes a cell from an item in the queue, and removes that queue item if it becomes empty
	 * @param cell The Cell to remove
	 * @param originTime The timestamp of the EventQueueItem to remove the Cell from
	 */
	removeCell(cell: Cell, originTime: number) {
		const originEventItem = this.getItem(originTime);

		delete originEventItem.setToBurning[cell.id];

		if (this.isItemEmpty(originEventItem)) {
			this.dequeue(originTime);
		}
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
	 * @param item EventQueueItem
	 */
	isItemEmpty(item: EventQueueItem) {
		return (
			lodash.isEmpty(item.setToBurning) && lodash.isEmpty(item.setToBurnedOut)
		);
	}

	/**
	 * Returns true if the queue is empty
	 * @returns boolean
	 */
	isEmpty(): boolean {
		return this.items.length === 0;
	}

	/**
	 * Clears the queue
	 */
	clear() {
		this.items = [];
	}
}

export default PriorityQueue;
