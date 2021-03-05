/**
 * Firestarter.io
 *
 * Commonly used constants, enums, and type definitions
 */

import { Matrix } from 'mathjs';

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
