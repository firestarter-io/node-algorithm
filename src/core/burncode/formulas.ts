/**
 * Firestarter.io
 *
 * Mathematical formulas describing variousa aspects of fire spread
 */

/**
 * Function which determines the probability that one burning Cell will ignite another.  Based on
 * ["PROPAGATOR: An Operational Cellular-Automata Based Wildfire Simulator"](https://www.mdpi.com/2571-6255/3/3/26/htm)
 * @param nominalSpreadP Nominal Fire Spread Probability (Probability of spread based solely on ground cover)
 * @param alphaWind Wind factor
 * @param alphaSlope Slope factor
 * @param ffmcE Fine fuel moisture content effect
 * @returns Probability of fire spread from one Cell to another.  Unitless number between 0 and 1
 */
const probabilityOfIgnition = (
	nominalSpreadP: number,
	alphaWind: number,
	alphaSlope: number,
	ffmcE: number
): number => {
	const effectiveFfmcE = ffmcE || 0.3;
	return (
		(1 - Math.pow(1 - nominalSpreadP, alphaSlope * alphaWind)) * effectiveFfmcE
	);
};

/**
 * Function which determines the alpha slope factor, which may positively or negatively
 * affect the burn probability of a cell.  Reverse engineered from figure 6 of
 * ["PROPAGATOR: An Operational Cellular-Automata Based Wildfire Simulator"](https://www.mdpi.com/2571-6255/3/3/26/htm)
 *
 * google "plot .5 + 0.75 * 1 /(e^(-(x^3 / 30000)) + 0.5 ) from -150 to 150"
 *
 * Could use some fine tuning
 * @param slope slope, in percent
 */
const alphaSlope = (slope: number) => {
	return (
		0.5 + 0.75 * (1 / (Math.pow(Math.E, -Math.pow(slope, 3) / 3000) + 0.5))
	);
};

/**
 * Function which determines the alpha wind factor, which may positively or negatively
 * affect the burn probability of a cell.  Reverse engineered from figure 7 of
 * ["PROPAGATOR: An Operational Cellular-Automata Based Wildfire Simulator"](https://www.mdpi.com/2571-6255/3/3/26/htm)
 *
 * Describes a group of equations which each approximate a normal distribution centered at x = 0
 *
 * @param direction Wind direction i degrees, relative to angle from Cell to NeighborCell
 * @param speed Wind speed in km/h
 */
const alphaWind = (direction: number, speed: number) => {
	if (speed === 0) {
		return 1;
	}
	const s = speed / 100;
	const yShift = 1 - s;
	const amplitude = 1 + 3 * s;
	const spread = Math.pow(10, speed / 100) / 100;
	return amplitude / Math.pow(Math.E, (spread * direction) ** 2) + yShift;
};

/**
 * Function to measure intensity of fireline, Byram (1959, page 79)
 * @param H | heat yield (Btu/lb of fuel), often 8000
 * @param w | weight of available fuel (lb /ft^2)
 * @param R | Rate of spread (feet / second )
 * @returns Btu/feet/second
 * Reference:
 * The Rothermel surface fire spread model and associated developments: A comprehensive explanation
 * https://www.fs.usda.gov/treesearch/pubs/55928
 */
const firelineIntensity = (H: number, w: number, R: number): number =>
	H * w * R;
