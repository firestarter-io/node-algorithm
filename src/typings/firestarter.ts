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
 * Commonly used constants, enums, and type definitions
 */

/**
 * Cell is a number tuple representing the [x. y] position of a cell in a matrix
 */
export type CellPosition = [number, number];

/**
 * Burn status integers - not in use for now as TS does not allow number ranges
 * 1 or great is BURNING
 * 0 is UNBURNED / UNTOUCHED
 * -1 BURNED_OUT
 * -2 SUPRESSED
 * May need to adjust burned out and supressed to allow for them to evolve over time
 */
export enum BurnStatuses {}
// BURNING >= 1,
// UNBURNED = 0,
// BURNED_OUT = -1,
// SUPRESSED = -2

/**
 * Different types of events that can be triggered / attached to a timestep
 */
export enum FireStarterEventTypes {
	NEW_FIRE_STARTED = 'NEW_FIRE_STARTED',
}

/**
 * Describes an event object that can be attached to a timestep
 * Includes information about what event occurred and where
 */
export interface FireStarterEvent {
	/**
	 * The type of event that ocurrsed
	 */
	type: FireStarterEventTypes;
	/**
	 * Where the event ocurred
	 */
	location: {
		/**
		 * Geometric location of event
		 */
		geometry: L.LatLng;
		/**
		 * Geocoded placename of event
		 */
		placename: string;
	};
}
