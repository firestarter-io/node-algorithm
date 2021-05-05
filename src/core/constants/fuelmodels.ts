/**
 * Firestarter.io
 *
 * Constants assocaited with LANDFIRE's fueld model layers
 */

interface FuelModel {
	/**
	 * String description of the fuel model
	 */
	description?: string;
	/**
	 * Fuel loading in tons / acre
	 */
	fuelLoading: {
		/**
		 * In 1 hour period
		 */
		oneHour: number;
		/**
		 * In 10 hour period
		 */
		tenHour: number;
		/**
		 * In 100 hour period
		 */
		hundredHour: number;
		/**
		 * Live
		 */
		live: number;
	};
	/**
	 * Depth of fuel bed, in feet
	 */
	fuelBedDepth: number;
	/**
	 * The fuel moisture content, as a percent, weighed over all the fuel classes,
	 * at which the fire will not spread. Also called extinction moisture content
	 */
	moistureOfExtinction: number;
	/**
	 * Rate of spread, in chains / hour, assuming windspeed of 5 mi/h (8 km /h)
	 * and moisture content of 8%.  1 chain per hour ~= 1.1 foot per minute
	 */
	rateOfSpread: number;
	/**
	 * Nonburnable status for nonburnable fuel types
	 */
	nonBurnable?: true;
}

/**
 * Based on the 13 Fire Behavior Fuel Models as defined in LANDFIRE
 * Definitions from "Aids to Determining Fuel Models For Estimating Fire Behavior", Hal E. Anderson, 1982
 */
const FBFM13: { [key: string]: FuelModel } = {
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
		moistureOfExtinction: 0,
	},
};
