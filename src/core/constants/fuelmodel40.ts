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

export interface FuelModel40 extends FuelModel {
	/**
	 * Packing ratio is a unitless ratio
	 *
	 * From [Standard Fire Behavior Fuel Models: A Comprehensive Set for Use with Rothermel’s Surface Fire Spread Model, Scott & Burgan, 2005](https://www.fs.fed.us/rm/pubs/rmrs_gtr153.pdf)
	 */
	packingRatio: number;
}

/**
 * Based on the 40 Fire Behavior Fuel Models as defined in LANDFIRE
 * LANDFIRE description of these models can be found [here](https://landfire.gov/fbfm40.php)
 * Definitions from [Standard Fire Behavior Fuel Models: A Comprehensive Set for Use with Rothermel’s Surface Fire Spread Model, Scott & Burgan, 2005](https://www.fs.fed.us/rm/pubs/rmrs_gtr153.pdf)
 *
 * Data also pulled from the very comprehensive [The Rothermel surface fire spread model and associated developments: A comprehensive explanation, 2018](https://www.fs.usda.gov/treesearch/pubs/55928) - fuel model tables begin on page 31 (39 of pdf)
 */
export const FBFM40: { [key: string]: FuelModel40 } = {
	GR1: {
		description: 'Short, sparse, dry climate grass',
		fuelLoading: {
			oneHour: 0.1,
			tenHour: 0,
			hundredHour: 0,
			live: 0.3,
		},
		fuelBedDepth: 0.4,
		packingRatio: 0.00143,
		relativePackingRatio: 0.22,
		bulkDensity: 0.05,
		moistureOfExtinction: 15,
	},
	GR2: {
		description: 'Low load, dry climate grass',
		fuelLoading: {
			oneHour: 0.1,
			tenHour: 0,
			hundredHour: 0,
			live: 1.0,
		},
		fuelBedDepth: 1.0,
		packingRatio: 0.00158,
		relativePackingRatio: 0.22,
		bulkDensity: 0.05,
		moistureOfExtinction: 15,
	},
	GR3: {
		description: 'Low load, very coarse, humid climate grass',
		fuelLoading: {
			oneHour: 0.1,
			tenHour: 0.4,
			hundredHour: 0,
			live: 1.5,
		},
		fuelBedDepth: 2.0,
		packingRatio: 0.00143,
		relativePackingRatio: 0.15,
		bulkDensity: 0.05,
		moistureOfExtinction: 30,
	},
	GR4: {
		description: 'Moderate load, dry climate grass',
		fuelLoading: {
			oneHour: 0.25,
			tenHour: 0,
			hundredHour: 0,
			live: 1.9,
		},
		fuelBedDepth: 2.0,
		packingRatio: 0.00154,
		relativePackingRatio: 0.22,
		bulkDensity: 0.05,
		moistureOfExtinction: 15,
	},
};
