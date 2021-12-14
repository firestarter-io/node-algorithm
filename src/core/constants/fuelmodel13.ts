/*
 * Firestarter.io
 *
 * Copyright (C) 2021 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

import { FuelModel } from './FuelModel';

/**
 * Constants assocaited with LANDFIRE's fuel model layers
 */

export interface FuelModel13 extends FuelModel {
	/**
	 * Rate of spread, in chains / hour, assuming windspeed of 5 mi/h (8 km/h)
	 * and moisture content of 8%.  1 chain per hour ~= 1.1 foot per minute or ~ 18 meters/hour
	 *
	 * Drawn directly from [Aids to Determining Fuel Models For Estimating Fire Behavior, Hal E. Anderson, 1982](https://www.fs.fed.us/rm/pubs_int/int_gtr122.pdf).
	 */
	rateOfSpread: number;
}

/**
 * Based on the 13 Fire Behavior Fuel Models as defined in LANDFIRE
 * Definitions from [Aids to Determining Fuel Models For Estimating Fire Behavior, Hal E. Anderson, 1982](https://www.fs.fed.us/rm/pubs_int/int_gtr122.pdf).
 *
 * Data also pulled from the very comprehensive [The Rothermel surface fire spread model and associated developments: A comprehensive explanation, 2018](https://www.fs.usda.gov/treesearch/pubs/55928) - fuel model tables begin on page 31 (39 of pdf)
 */
export const FBFM13: { [key: string]: FuelModel13 } = {
	/** Grass and grass-dominated */
	FBFM1: {
		description: 'Short grass (1 foot)',
		fuelLoading: {
			oneHour: 0.74,
			tenHour: 0,
			hundredHour: 0,
			live: 0,
		},
		fuelBedDepth: 1,
		relativePackingRatio: 0.25,
		bulkDensity: 0.03,
		moistureOfExtinction: 12,
		rateOfSpread: 78,
	},
	FBFM2: {
		description: 'Timber (grass and understory)',
		fuelLoading: {
			oneHour: 2,
			tenHour: 1,
			hundredHour: 0.5,
			live: 0.5,
		},
		fuelBedDepth: 1,
		relativePackingRatio: 1.14,
		bulkDensity: 0.18,
		moistureOfExtinction: 15,
		rateOfSpread: 35,
	},
	FBFM3: {
		description: 'Tall grass (2.5 feet)',
		fuelLoading: {
			oneHour: 3.01,
			tenHour: 0,
			hundredHour: 0,
			live: 0,
		},
		fuelBedDepth: 2.5,
		relativePackingRatio: 0.21,
		bulkDensity: 0.06,
		moistureOfExtinction: 25,
		rateOfSpread: 104,
	},
	/** Chaparral and shrub fields */
	FBFM4: {
		description: 'Chaparral (6 feet)',
		fuelLoading: {
			oneHour: 5.01,
			tenHour: 4.01,
			hundredHour: 2,
			live: 5.01,
		},
		fuelBedDepth: 6,
		relativePackingRatio: 0.52,
		bulkDensity: 0.12,
		moistureOfExtinction: 20,
		rateOfSpread: 75,
	},
	FBFM5: {
		description: 'Brush (2 feet)',
		fuelLoading: {
			oneHour: 1,
			tenHour: 0.5,
			hundredHour: 0,
			live: 2,
		},
		fuelBedDepth: 2,
		relativePackingRatio: 0.33,
		bulkDensity: 0.08,
		moistureOfExtinction: 20,
		rateOfSpread: 18,
	},
	FBFM6: {
		description: 'Dormant brush, hardwood slash',
		fuelLoading: {
			oneHour: 1.5,
			tenHour: 2.5,
			hundredHour: 2,
			live: 0,
		},
		fuelBedDepth: 2.5,
		relativePackingRatio: 0.43,
		bulkDensity: 0.11,
		moistureOfExtinction: 25,
		rateOfSpread: 32,
	},
	FBFM7: {
		description: 'Southern rough',
		fuelLoading: {
			oneHour: 1.13,
			tenHour: 1.87,
			hundredHour: 1.5,
			live: 0.37,
		},
		fuelBedDepth: 2.5,
		relativePackingRatio: 0.34,
		bulkDensity: 0.09,
		moistureOfExtinction: 40,
		rateOfSpread: 20,
	},
	/** Timber litter */
	FBFM8: {
		description: 'Closed timber litter',
		fuelLoading: {
			oneHour: 1.5,
			tenHour: 1,
			hundredHour: 2.5,
			live: 0,
		},
		fuelBedDepth: 0.2,
		relativePackingRatio: 5.17,
		bulkDensity: 1.15,
		moistureOfExtinction: 30,
		rateOfSpread: 1.6,
	},
	FBFM9: {
		description: 'Hardwood litter',
		fuelLoading: {
			oneHour: 2.92,
			tenHour: 41,
			hundredHour: 0.15,
			live: 0,
		},
		fuelBedDepth: 0.2,
		relativePackingRatio: 4.5,
		bulkDensity: 0.8,
		moistureOfExtinction: 25,
		rateOfSpread: 7.5,
	},
	FBFM10: {
		description: 'Timber (litter and understory)',
		fuelLoading: {
			oneHour: 3.01,
			tenHour: 2,
			hundredHour: 5.01,
			live: 2,
		},
		fuelBedDepth: 1,
		relativePackingRatio: 2.35,
		bulkDensity: 0.55,
		moistureOfExtinction: 25,
		rateOfSpread: 7.9,
	},
	/** Slash */
	FBFM11: {
		description: 'Light logging slash',
		fuelLoading: {
			oneHour: 1.5,
			tenHour: 4.51,
			hundredHour: 5.51,
			live: 0,
		},
		fuelBedDepth: 1,
		relativePackingRatio: 1.62,
		bulkDensity: 0.53,
		moistureOfExtinction: 15,
		rateOfSpread: 6,
	},
	FBFM12: {
		description: 'Medium logging slash',
		fuelLoading: {
			oneHour: 4.01,
			tenHour: 14.03,
			hundredHour: 16.53,
			live: 0,
		},
		fuelBedDepth: 2.3,
		relativePackingRatio: 2.06,
		bulkDensity: 0.69,
		moistureOfExtinction: 20,
		rateOfSpread: 13,
	},
	FBFM13: {
		description: 'Heavy logging slash',
		fuelLoading: {
			oneHour: 7.01,
			tenHour: 23.04,
			hundredHour: 28.05,
			live: 0,
		},
		fuelBedDepth: 3,
		relativePackingRatio: 2.68,
		bulkDensity: 0.89,
		moistureOfExtinction: 25,
		rateOfSpread: 13.5,
	},
	/** Nonburnables */
	Urban: {
		nonBurnable: true,
		rateOfSpread: 0,
		fuelLoading: {
			oneHour: 0,
			tenHour: 0,
			hundredHour: 0,
			live: 0,
		},
		fuelBedDepth: 0,
		relativePackingRatio: 0,
		bulkDensity: 0,
		moistureOfExtinction: 0,
	},
	'Snow/Ice': {
		nonBurnable: true,
		rateOfSpread: 0,
		fuelLoading: {
			oneHour: 0,
			tenHour: 0,
			hundredHour: 0,
			live: 0,
		},
		fuelBedDepth: 0,
		relativePackingRatio: 0,
		bulkDensity: 0,
		moistureOfExtinction: 0,
	},
	Agriculture: {
		nonBurnable: true,
		rateOfSpread: 0,
		fuelLoading: {
			oneHour: 0,
			tenHour: 0,
			hundredHour: 0,
			live: 0,
		},
		fuelBedDepth: 0,
		relativePackingRatio: 0,
		bulkDensity: 0,
		moistureOfExtinction: 0,
	},
	Water: {
		nonBurnable: true,
		rateOfSpread: 0,
		fuelLoading: {
			oneHour: 0,
			tenHour: 0,
			hundredHour: 0,
			live: 0,
		},
		fuelBedDepth: 0,
		relativePackingRatio: 0,
		bulkDensity: 0,
		moistureOfExtinction: 0,
	},
	Barren: {
		nonBurnable: true,
		rateOfSpread: 0,
		fuelLoading: {
			oneHour: 0,
			tenHour: 0,
			hundredHour: 0,
			live: 0,
		},
		fuelBedDepth: 0,
		relativePackingRatio: 0,
		bulkDensity: 0,
		moistureOfExtinction: 0,
	},
	NoData: {
		nonBurnable: true,
		rateOfSpread: 0,
		fuelLoading: {
			oneHour: 0,
			tenHour: 0,
			hundredHour: 0,
			live: 0,
		},
		fuelBedDepth: 0,
		relativePackingRatio: 0,
		bulkDensity: 0,
		moistureOfExtinction: 0,
	},
};
