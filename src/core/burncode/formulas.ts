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
