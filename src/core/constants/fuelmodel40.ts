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
	/** Grass Fuel Type Models (GR) */
	GR1: {
		label: 'GR1',
		name: 'Short, sparse, dry climate grass',
		description:
			'The primary carrier of fire in GR1 is sparse grass, though small amounts of fine dead fuel may be present. The grass in GR1 is generally short, either naturally or by grazing, and may be sparse or discontinuous. The moisture of extinction of GR1 is indicative of a dry climate fuelbed, but GR1 may also be applied in high-extinction moisture fuelbeds because in both cases predicted spread rate and flame length are low compared to other GR models.',
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
		label: 'GR2',
		name: 'Low load, dry climate grass',
		description:
			'The primary carrier of fire in GR2 is grass, though small amounts of fine dead fuel may be present. Load is greater than GR1, and fuelbed may be more continuous. Shrubs, if present, do not affect fire behavior.',
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
		label: 'GR3',
		name: 'Low load, very coarse, humid climate grass',
		description:
			'The primary carrier of fire in GR3 is continuous, coarse, humid-climate grass. Grass and herb fuel load is relatively light; fuelbed depth is about 2 feet. Shrubs are not present in significant quantity to affect fire behavior.',
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
		label: 'GR4',
		name: 'Moderate load, dry climate grass',
		description:
			'The primary carrier of fire in GR4 is continuous, dry-climate grass. Load and depth are greater than GR2; fuelbed depth is about 2 feet.',
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
		label: 'GR5',
		name: 'Low load, humid climate grass',
		description:
			'The primary carrier of fire in GR5 is humid-climate grass. Load is greater than GR3 but depth is lower, about 1 to 2 feet.',
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
		label: 'GR6',
		name: 'Moderate load, humid climate grass',
		description:
			'The primary carrier of fire in GR6 is continuous humid-climate grass. Load is greater than GR5 but depth is about the same. Grass is less coarse than GR5.',
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
		label: 'GR7',
		name: 'High load, dry climate grass',
		description:
			'The primary carrier of fire in GR7 is continuous dry-climate grass. Load and depth are greater than GR4. Grass is about 3 feet tall.',
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
		label: 'GR8',
		name: 'High load, very coarse, humid climate grass',
		description:
			'The primary carrier of fire in GR8 is continuous, very coarse, humidclimate grass. Load and depth are greater than GR6. Spread rate and flame length can be extreme if grass is fully cured.',
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
		label: 'GR9',
		name: 'Very high load, humid climate grass',
		description:
			'The primary carrier of fire in GR9 is dense, tall, humid-climate grass. Load and depth are greater than GR8, about 6 feet tall. Spread rate and flame length can be extreme if grass is fully or mostly cured.',
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
	/** Grass-Shrub Fuel Type Models (GS) */
	GS1: {
		label: 'GS1',
		name: 'Low load, dry climate grass-shrub',
		description:
			'The primary carrier of fire in GS1 is grass and shrubs combined. Shrubs are about 1 foot high, grass load is low. Spread rate is moderate; flame length low. Moisture of extinction is low.',
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
		label: 'GS2',
		name: 'Moderate load, dry climate grass-shrub',
		description:
			'The primary carrier of fire in GS2 is grass and shrubs combined. Shrubs are 1 to 3 feet high, grass load is moderate. Spread rate is high; flame length moderate. Moisture of extinction is low.',
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
		label: 'GS3',
		name: 'Moderate load, humid climate grass-shrub',
		description:
			'The primary carrier of fire in GS3 is grass and shrubs combined. Moderate grass/shrub load, average grass/shrub depth less than 2 feet. Spread rate is high; flame length moderate. Moisture of extinction is high.',
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
		label: 'GS4',
		name: 'High load, humid climate grass-shrub',
		description:
			'The primary carrier of fire in GS4 is grass and shrubs combined. Heavy grass/shrub load, depth greater than 2 feet. Spread rate high; flame length very high. Moisture of extinction is high.',
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
	/** Shrub Fuel Type Models (SH) */
	SH1: {
		label: 'SH1',
		name: 'Low load, dry climate shrub',
		description:
			'The primary carrier of fire in SH1 is woody shrubs and shrub litter. Low shrub fuel load, fuelbed depth about 1 foot; some grass may be present. Spread rate is very low; flame length very low.',
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
		label: 'SH2',
		name: 'Moderate load, dry climate shrub',
		description:
			'The primary carrier of fire in SH2 is woody shrubs and shrub litter. Moderate fuel load (higher than SH1), depth about 1 foot, no grass fuel present. Spread rate is low; flame length low.',
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
		label: 'SH3',
		name: 'Moderate load, humid climate shrub',
		description:
			'The primary carrier of fire in SH3 is woody shrubs and shrub litter. Moderate shrub load, possibly with pine overstory or herbaceous fuel, fuel bed depth 2 to 3 feet. Spread rate is low; flame length low.',
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
		label: 'SH4',
		name: 'Low load, humid climate timber-shrub',
		description:
			'The primary carrier of fire in SH4 is woody shrubs and shrub litter. Low to moderate shrub and litter load, possibly with pine overstory, fuel bed depth about 3 feet. Spread rate is high; flame length moderate.',
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
		label: 'SH5',
		name: 'High load, dry climate shrub',
		description:
			'The primary carrier of fire in SH5 is woody shrubs and shrub litter. Heavy shrub load, depth 4-6 feet. Spread rate very high; flame length very high. Moisture of extinction is high.',
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
		label: 'SH6',
		name: 'Low load, humid climate shrub',
		description:
			'The primary carrier of fire in SH6 is woody shrubs and shrub litter. Dense shrubs, little or no herbaceous fuel, fuelbed depth about 2 feet. Spread rate is high; flame length high.',
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
		label: 'SH7',
		name: 'Very high load, dry climate shrub',
		description:
			'The primary carrier of fire in SH7 is woody shrubs and shrub litter. Very heavy shrub load, depth 4 to 6 feet. Spread rate lower than SH7, but flame length similar. Spread rate is high; flame length very high.',
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
		label: 'SH8',
		name: 'High load, humid climate shrub',
		description:
			'The primary carrier of fire in SH8 is woody shrubs and shrub litter. Dense shrubs, little or no herbaceous fuel, fuelbed depth about 3 feet. Spread rate is high; flame length high.',
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
	SH9: {
		label: 'SH9',
		name: 'Very high load, humid climate shrub',
		description:
			'The primary carrier of fire in SH9 is woody shrubs and shrub litter. Dense, finely branched shrubs with significant fine dead fuel, about 4 to 6 feet tall; some herbaceous fuel may be present. Spread rate is high, flame length very high.',
		fuelLoading: {
			oneHour: 4.5,
			tenHour: 2.45,
			hundredHour: 0,
			live: 1.55,
		},
		fuelBedDepth: 3.0,
		packingRatio: 0.00505,
		relativePackingRatio: 0.56,
		bulkDensity: 0.16,
		moistureOfExtinction: 40,
	},
	/** Timber-Understory Fuel Type Models (TU) */
	TU1: {
		label: 'TU1',
		name: 'Light load, dry climate timber-grass-shrub',
		description:
			'The primary carrier of fire in TU1 is low load of grass and/or shrub with litter. Spread rate is low; flame length low.',
		fuelLoading: {
			oneHour: 0.2,
			tenHour: 0.9,
			hundredHour: 1.5,
			live: 0.2,
		},
		fuelBedDepth: 0.6,
		packingRatio: 0.00885,
		relativePackingRatio: 1.12,
		bulkDensity: 0.28,
		moistureOfExtinction: 20,
	},
	TU2: {
		label: 'TU2',
		name: 'Moderate load, humid climate timber-shrub',
		description:
			'The primary carrier of fire in TU2 is moderate litter load with shrub component. High extinction moisture. Spread rate is moderate; flame length low.',
		fuelLoading: {
			oneHour: 0.95,
			tenHour: 1.8,
			hundredHour: 1.25,
			live: 0,
		},
		fuelBedDepth: 1.0,
		packingRatio: 0.00603,
		relativePackingRatio: 0.82,
		bulkDensity: 0.19,
		moistureOfExtinction: 30,
	},
	TU3: {
		label: 'TU3',
		name: 'Moderate load, humid climate timber-grass-shrub',
		description:
			'The primary carrier of fire in TU3 is moderate forest litter with grass and shrub components. Extinction moisture is high. Spread rate is high; flame length moderate.',
		fuelLoading: {
			oneHour: 1.1,
			tenHour: 0.15,
			hundredHour: 0.25,
			live: 0.65,
		},
		fuelBedDepth: 1.3,
		packingRatio: 0.00359,
		relativePackingRatio: 0.45,
		bulkDensity: 0.11,
		moistureOfExtinction: 30,
	},
	TU4: {
		label: 'TU4',
		name: 'Dwarf conifer understory',
		description:
			'The primary carrier of fire in TU4 is short conifer trees with grass or moss understory. Spread rate is moderate; flame length moderate.',
		fuelLoading: {
			oneHour: 4.5,
			tenHour: 0,
			hundredHour: 0,
			live: 0,
		},
		fuelBedDepth: 0.5,
		packingRatio: 0.01865,
		relativePackingRatio: 3.06,
		bulkDensity: 0.6,
		moistureOfExtinction: 12,
	},
	TU5: {
		label: 'TU5',
		name: 'Very high load, dry climate timber-shrub',
		description:
			'The primary carrier of fire in TU5 is heavy forest litter with a shrub or small tree understory. Spread rate is moderate; flame length moderate.',
		fuelLoading: {
			oneHour: 4.0,
			tenHour: 4.0,
			hundredHour: 3.0,
			live: 0,
		},
		fuelBedDepth: 1.0,
		packingRatio: 0.02009,
		relativePackingRatio: 2.03,
		bulkDensity: 0.64,
		moistureOfExtinction: 25,
	},
	/** Timber Litter Fuel Type Models (TL) */
	TL1: {
		label: 'TL1',
		name: 'Low load, compact conifer litter',
		description:
			'The primary carrier of fire in TL1 is compact forest litter. Light to moderate load, fuels 1 to 2 inches deep. May be used to represent a recently burned forest. Spread rate is very low; flame length very low.',
		fuelLoading: {
			oneHour: 1.0,
			tenHour: 2.2,
			hundredHour: 3.6,
			live: 0,
		},
		fuelBedDepth: 0.2,
		packingRatio: 0.04878,
		relativePackingRatio: 6.49,
		bulkDensity: 1.56,
		moistureOfExtinction: 30,
	},
	TL2: {
		label: 'TL2',
		name: 'Low broadleaf litter',
		description:
			'The primary carrier of fire in TL2 is broadleaf (hardwood) litter. Low load, compact broadleaf litter. Spread rate is very low; flame length very low.',
		fuelLoading: {
			oneHour: 1.4,
			tenHour: 2.3,
			hundredHour: 2.2,
			live: 0,
		},
		fuelBedDepth: 0.2,
		packingRatio: 0.04232,
		relativePackingRatio: 5.87,
		bulkDensity: 1.35,
		moistureOfExtinction: 25,
	},
	TL3: {
		label: 'TL3',
		name: 'Moderate load conifer litter',
		description:
			'The primary carrier of fire in TL3 is moderate load conifer litter, light load of coarse fuels. Spread rate is very low; flame length low.',
		fuelLoading: {
			oneHour: 0.5,
			tenHour: 2.2,
			hundredHour: 2.9,
			live: 0,
		},
		fuelBedDepth: 0.3,
		packingRatio: 0.0263,
		relativePackingRatio: 3.19,
		bulkDensity: 0.84,
		moistureOfExtinction: 20,
	},
	TL4: {
		label: 'TL4',
		name: 'Small downed logs',
		description:
			'The primary carrier of fire in TL4 is moderate load of fine litter and coarse fuels. Includes small diameter downed logs. Spread rate is low; flame length low.',
		fuelLoading: {
			oneHour: 0.5,
			tenHour: 1.5,
			hundredHour: 4.2,
			live: 0,
		},
		fuelBedDepth: 0.4,
		packingRatio: 0.02224,
		relativePackingRatio: 2.75,
		bulkDensity: 0.71,
		moistureOfExtinction: 25,
	},
	TL5: {
		label: 'TL5',
		name: 'High load conifer litter',
		description:
			'The primary carrier of fire in TL5 is high load conifer litter; light slash or mortality fuel. Spread rate is low; flame length low.',
		fuelLoading: {
			oneHour: 1.15,
			tenHour: 2.5,
			hundredHour: 4.4,
			live: 0,
		},
		fuelBedDepth: 0.6,
		packingRatio: 0.01925,
		relativePackingRatio: 2.56,
		bulkDensity: 0.62,
		moistureOfExtinction: 25,
	},
	TL6: {
		label: 'TL6',
		name: 'Moderate load broadleaf litter',
		description:
			'The primary carrier of fire in TL6 is moderate load broadleaf litter, less compact than TL2. Spread rate is moderate; flame length low.',
		fuelLoading: {
			oneHour: 2.4,
			tenHour: 1.2,
			hundredHour: 1.2,
			live: 0,
		},
		fuelBedDepth: 0.3,
		packingRatio: 0.02296,
		relativePackingRatio: 3.37,
		bulkDensity: 0.73,
		moistureOfExtinction: 25,
	},
	TL7: {
		label: 'TL7',
		name: 'Large downed logs',
		description:
			'The primary carrier of fire in TL7 is heavy load forest litter, includes larger diameter downed logs. Spread rate low; flame length low.',
		fuelLoading: {
			oneHour: 0.3,
			tenHour: 1.4,
			hundredHour: 8.1,
			live: 0,
		},
		fuelBedDepth: 0.4,
		packingRatio: 0.03515,
		relativePackingRatio: 3.56,
		bulkDensity: 1.12,
		moistureOfExtinction: 25,
	},
	TL8: {
		label: 'TL8',
		name: 'Long-needle litter',
		description:
			'The primary carrier of fire in TL8 is moderate load long-needle pine litter, may include small amount of herbaceous load. Spread rate is moderate; flame length low.',
		fuelLoading: {
			oneHour: 5.8,
			tenHour: 1.4,
			hundredHour: 1.1,
			live: 0,
		},
		fuelBedDepth: 0.3,
		packingRatio: 0.03969,
		relativePackingRatio: 5.42,
		bulkDensity: 1.27,
		moistureOfExtinction: 35,
	},
	TL9: {
		label: 'TL9',
		name: 'Very high load broadleaf litter',
		description:
			'The primary carrier of fire in TL9 is very high load, fluffy broadleaf litter. TL9 can also be used to represent heavy needle-drape. Spread rate is moderate; flame length moderate.',
		fuelLoading: {
			oneHour: 6.65,
			tenHour: 3.3,
			hundredHour: 4.15,
			live: 0,
		},
		fuelBedDepth: 0.6,
		packingRatio: 0.03372,
		relativePackingRatio: 4.52,
		bulkDensity: 1.08,
		moistureOfExtinction: 35,
	},
	/** Slash-Blowdown Fuel Type Models (SB) */
	SB1: {
		label: 'SB1',
		name: 'Low load activity fuel',
		description:
			'The primary carrier of fire in SB1 is light dead and down activity fuel. Fine fuel load is 10 to 20 t/ac, weighted toward fuels 1 to 3 inches diameter class, depth is less than 1 foot. Spread rate is moderate; flame length low.',
		fuelLoading: {
			oneHour: 1.5,
			tenHour: 3.0,
			hundredHour: 11.0,
			live: 0,
		},
		fuelBedDepth: 1.0,
		packingRatio: 0.02224,
		relativePackingRatio: 2.87,
		bulkDensity: 0.71,
		moistureOfExtinction: 25,
	},
	SB2: {
		label: 'SB2',
		name: 'Moderate load activity or low load blowdown',
		description:
			'The primary carrier of fire in SB2 is moderate dead and down activity fuel or light blowdown. Fine fuel load is 7 to 12 t/ac, evenly distributed across 0 to 0.25, 0.25 to 1, and 1 to 3 inch diameter classes, depth is about 1 foot. Blowdown is scattered, with many trees still standing. Spread rate is moderate; flame length moderate.',
		fuelLoading: {
			oneHour: 4.5,
			tenHour: 4.25,
			hundredHour: 4.0,
			live: 0,
		},
		fuelBedDepth: 1.0,
		packingRatio: 0.01829,
		relativePackingRatio: 2.63,
		bulkDensity: 0.59,
		moistureOfExtinction: 25,
	},
	SB3: {
		label: 'SB3',
		name: 'High load activity fuel or moderate low blowdown',
		description:
			'The primary carrier of fire in SB3 is heavy dead and down activity fuel or moderate blowdown. Fine fuel load is 7 to 12 t/ac, weighted toward 0 to 0.25 inch diameter class, depth is more than 1 foot. Blowdown is moderate, trees compacted to near the ground. Spread rate is high; flame length high.',
		fuelLoading: {
			oneHour: 5.5,
			tenHour: 2.75,
			hundredHour: 3.0,
			live: 0,
		},
		fuelBedDepth: 1.2,
		packingRatio: 0.01345,
		relativePackingRatio: 1.97,
		bulkDensity: 0.43,
		moistureOfExtinction: 25,
	},
	SB4: {
		label: 'SB4',
		name: 'High load blowdown',
		description:
			'The primary carrier of fire in SB4 is heavy blowdown fuel. Blowdown istotal, fuelbed not compacted, most foliage and fine fuel still attached to blowdown.Spread rate very high; flame length very high.',
		fuelLoading: {
			oneHour: 5.25,
			tenHour: 3.5,
			hundredHour: 5.25,
			live: 0,
		},
		fuelBedDepth: 2.7,
		packingRatio: 0.00744,
		relativePackingRatio: 1.08,
		bulkDensity: 0.24,
		moistureOfExtinction: 25,
	},
	/** Nonburnables */
	NB1: {
		label: 'NB1',
		name: 'Urban/Developed',
		description:
			'Fuel model NB1 consists of land covered by urban and suburban development. To be called NB1, the area under consideration must not support wildland fire spread. In some cases, areas mapped as NB1 may experience structural fire losses during a wildland fire incident; however, structure ignition in those cases is either house-to-house or by firebrands, neither of which is directly modeled using fire behavior fuel models. If sufficient fuel vegetation surrounds structures such that wildland fire spread is possible, then choose a fuel model appropriate for the wildland vegetation rather than NB1.',
		nonBurnable: true,
		fuelLoading: {
			oneHour: 0,
			tenHour: 0,
			hundredHour: 0,
			live: 0,
		},
		fuelBedDepth: 0,
		packingRatio: 0,
		relativePackingRatio: 0,
		bulkDensity: 0,
		moistureOfExtinction: 0,
	},
	NB2: {
		label: 'NB2',
		name: 'Snow/Ice',
		description:
			'Land covered by permanent snow or ice is included in NB2. Areas covered by seasonal snow can be mapped to two different fuel models: NB2 for use when snow-covered and another for use in the fire season.',
		nonBurnable: true,
		fuelLoading: {
			oneHour: 0,
			tenHour: 0,
			hundredHour: 0,
			live: 0,
		},
		fuelBedDepth: 0,
		packingRatio: 0,
		relativePackingRatio: 0,
		bulkDensity: 0,
		moistureOfExtinction: 0,
	},
	NB3: {
		label: 'NB3',
		name: 'Agricultural',
		description:
			'Fuel model NB3 is agricultural land maintained in a nonburnable condition; examples include irrigated annual crops, mowed or tilled orchards, and so forth. However, there are many agricultural areas that are not kept in a nonburnable condition. For example, grass is often allowed to grow beneath vines or orchard trees, and wheat or similar crops are allowed to cure before harvest; in those cases use a fuel model other than NB3.',
		nonBurnable: true,
		fuelLoading: {
			oneHour: 0,
			tenHour: 0,
			hundredHour: 0,
			live: 0,
		},
		fuelBedDepth: 0,
		packingRatio: 0,
		relativePackingRatio: 0,
		bulkDensity: 0,
		moistureOfExtinction: 0,
	},
	NB8: {
		label: 'NB8',
		name: 'Open Water',
		description:
			'Land covered by open bodies of water such as lakes, rivers and oceans comprises NB8.',
		nonBurnable: true,
		fuelLoading: {
			oneHour: 0,
			tenHour: 0,
			hundredHour: 0,
			live: 0,
		},
		fuelBedDepth: 0,
		packingRatio: 0,
		relativePackingRatio: 0,
		bulkDensity: 0,
		moistureOfExtinction: 0,
	},
	NB9: {
		label: 'NB9',
		name: 'Bare Ground',
		description:
			'Land devoid of enough fuel to support wildland fire spread is covered by fuel model NB9. Such areas may include gravel pits, arid deserts with little vegetation, sand dunes, rock outcroppings, beaches, and so forth.',
		nonBurnable: true,
		fuelLoading: {
			oneHour: 0,
			tenHour: 0,
			hundredHour: 0,
			live: 0,
		},
		fuelBedDepth: 0,
		packingRatio: 0,
		relativePackingRatio: 0,
		bulkDensity: 0,
		moistureOfExtinction: 0,
	},
};
