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
	GR5: {
		description: 'Low load, humid climate grass',
		fuelLoading: {
			oneHour: 0.4,
			tenHour: 0,
			hundredHour: 0,
			live: 2.5,
		},
		fuelBedDepth: 1.5,
		packingRatio: 0.00277,
		relativePackingRatio: 0.35,
		bulkDensity: 0.09,
		moistureOfExtinction: 40,
	},
	GR6: {
		description: 'Moderate load, humid climate grass',
		fuelLoading: {
			oneHour: 0.1,
			tenHour: 0,
			hundredHour: 0,
			live: 3.4,
		},
		fuelBedDepth: 1.5,
		packingRatio: 0.00335,
		relativePackingRatio: 0.51,
		bulkDensity: 0.11,
		moistureOfExtinction: 40,
	},
	GR7: {
		description: 'High load, dry climate grass',
		fuelLoading: {
			oneHour: 1.0,
			tenHour: 0,
			hundredHour: 0,
			live: 5.4,
		},
		fuelBedDepth: 3.0,
		packingRatio: 0.00306,
		relativePackingRatio: 0.43,
		bulkDensity: 0.1,
		moistureOfExtinction: 15,
	},
	GR8: {
		description: 'High load, very coarse, humid climate grass',
		fuelLoading: {
			oneHour: 0.5,
			tenHour: 1.0,
			hundredHour: 0,
			live: 7.3,
		},
		fuelBedDepth: 4.0,
		packingRatio: 0.00316,
		relativePackingRatio: 0.33,
		bulkDensity: 0.1,
		moistureOfExtinction: 30,
	},
	GR9: {
		description: 'Very high load, humid climate grass',
		fuelLoading: {
			oneHour: 1.0,
			tenHour: 1.0,
			hundredHour: 0,
			live: 9.0,
		},
		fuelBedDepth: 5.0,
		packingRatio: 0.00316,
		relativePackingRatio: 0.4,
		bulkDensity: 0.1,
		moistureOfExtinction: 40,
	},
	GS1: {
		description: 'Low load, dry climate grass-shrub',
		fuelLoading: {
			oneHour: 0.2,
			tenHour: 0,
			hundredHour: 0,
			live: 0.5,
		},
		fuelBedDepth: 0.9,
		packingRatio: 0.00215,
		relativePackingRatio: 0.3,
		bulkDensity: 0.07,
		moistureOfExtinction: 15,
	},
	GS2: {
		description: 'Moderate load, dry climate grass-shrub',
		fuelLoading: {
			oneHour: 0.5,
			tenHour: 0.5,
			hundredHour: 0,
			live: 0.6,
		},
		fuelBedDepth: 1.5,
		packingRatio: 0.00249,
		relativePackingRatio: 0.35,
		bulkDensity: 0.08,
		moistureOfExtinction: 15,
	},
	GS3: {
		description: 'Moderate load, humid climate grass-shrub',
		fuelLoading: {
			oneHour: 0.3,
			tenHour: 0.25,
			hundredHour: 0,
			live: 1.45,
		},
		fuelBedDepth: 1.8,
		packingRatio: 0.00259,
		relativePackingRatio: 0.33,
		bulkDensity: 0.08,
		moistureOfExtinction: 15,
	},
	GS4: {
		description: 'High load, humid climate grass-shrub',
		fuelLoading: {
			oneHour: 1.9,
			tenHour: 0.3,
			hundredHour: 0.1,
			live: 3.4,
		},
		fuelBedDepth: 2.1,
		packingRatio: 0.00874,
		relativePackingRatio: 1.12,
		bulkDensity: 0.28,
		moistureOfExtinction: 40,
	},
	SH1: {
		description: 'Low load, dry climate shrub',
		fuelLoading: {
			oneHour: 0.25,
			tenHour: 0.25,
			hundredHour: 0.1,
			live: 0.15,
		},
		fuelBedDepth: 1.0,
		packingRatio: 0.0028,
		relativePackingRatio: 0.36,
		bulkDensity: 0.09,
		moistureOfExtinction: 15,
	},
	SH2: {
		description: 'Moderate load, dry climate shrub',
		fuelLoading: {
			oneHour: 1.35,
			tenHour: 2.4,
			hundredHour: 0.75,
			live: 0,
		},
		fuelBedDepth: 1.0,
		packingRatio: 0.01198,
		relativePackingRatio: 1.56,
		bulkDensity: 0.38,
		moistureOfExtinction: 15,
	},
	SH3: {
		description: 'Moderate load, humid climate shrub',
		fuelLoading: {
			oneHour: 0.45,
			tenHour: 3.0,
			hundredHour: 0,
			live: 0,
		},
		fuelBedDepth: 2.4,
		packingRatio: 0.00577,
		relativePackingRatio: 0.64,
		bulkDensity: 0.18,
		moistureOfExtinction: 40,
	},
	SH4: {
		description: 'Low load, humid climate timber-shrub',
		fuelLoading: {
			oneHour: 0.85,
			tenHour: 1.15,
			hundredHour: 0.2,
			live: 0,
		},
		fuelBedDepth: 3.0,
		packingRatio: 0.00227,
		relativePackingRatio: 0.3,
		bulkDensity: 0.07,
		moistureOfExtinction: 30,
	},
	SH5: {
		description: 'High load, dry climate shrub',
		fuelLoading: {
			oneHour: 3.6,
			tenHour: 2.1,
			hundredHour: 0.2,
			live: 0,
		},
		fuelBedDepth: 6.0,
		packingRatio: 0.00206,
		relativePackingRatio: 0.21,
		bulkDensity: 0.07,
		moistureOfExtinction: 15,
	},
	SH6: {
		description: 'Low load, humid climate shrub',
		fuelLoading: {
			oneHour: 2.9,
			tenHour: 1.45,
			hundredHour: 0.2,
			live: 0,
		},
		fuelBedDepth: 2.0,
		packingRatio: 0.00412,
		relativePackingRatio: 0.39,
		bulkDensity: 0.13,
		moistureOfExtinction: 30,
	},
	SH7: {
		description: 'Very high load, dry climate shrub',
		fuelLoading: {
			oneHour: 3.5,
			tenHour: 5.3,
			hundredHour: 2.2,
			live: 0,
		},
		fuelBedDepth: 6.0,
		packingRatio: 0.00344,
		relativePackingRatio: 0.35,
		bulkDensity: 0.11,
		moistureOfExtinction: 15,
	},
	SH8: {
		description: 'High load, humid climate shrub',
		fuelLoading: {
			oneHour: 2.05,
			tenHour: 3.4,
			hundredHour: 0.85,
			live: 0,
		},
		fuelBedDepth: 3.0,
		packingRatio: 0.00509,
		relativePackingRatio: 0.57,
		bulkDensity: 0.16,
		moistureOfExtinction: 40,
	},
};
