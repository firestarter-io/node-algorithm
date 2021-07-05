/**
 * Firestarter.io
 *
 * Mathematical formulas describing variousa aspects of fire spread
 */

/**
 * ---------------------- FUNCTIONS FROM PROPAGATOR --------------------------
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
export const probabilityOfIgnition = (
	nominalSpreadP: number,
	alphaWind: number,
	alphaSlope: number,
	ffmcE: number = 0.3
): number => {
	return (1 - Math.pow(1 - nominalSpreadP, alphaSlope * alphaWind)) * ffmcE;
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
export const alphaSlope = (slope: number) => {
	return (
		0.5 + 0.75 * (1 / (Math.pow(Math.E, -Math.pow(slope, 3) / 30000) + 0.5))
	);
};

/**
 * Function which determines the alpha wind factor, which may positively or negatively
 * affect the burn probability of a cell.  Reverse engineered from figure 7 of
 * ["PROPAGATOR: An Operational Cellular-Automata Based Wildfire Simulator"](https://www.mdpi.com/2571-6255/3/3/26/htm)
 *
 * Describes a group of equations which each approximate a normal distribution centered at x = 0
 *
 * google plot   4/(e^(((x/10)^2))),   (4-3/10)/(e^(((x/20)^2))) + 0.1,  (4-3*3/10)/(e^(((x/40)^2))) + 0.3, (4-10*3/10)/(e^(((x/1600)^2))) + 1 from -200 to 200
 *
 * @param direction Wind direction i degrees, relative to angle from Cell to NeighborCell
 * @param speed Wind speed in km/h
 * @returns Alpha wind, a unitless scaling factor which can positively or negatively affect burn probability
 */
export const alphaWind = (direction: number, speed: number) => {
	if (speed === 0) {
		return 1;
	}
	/**
	 * Scaling factor, based on speed, helps determine bell amplitude and yShift
	 */
	const s = speed / 100;
	/**
	 * The 'floor' of the bell curve.  1 for speed = 0 km/h, drops to 0 for speed >= 100 km/h
	 */
	const yShift = speed > 100 ? 1 - s : 0;
	/**
	 * The amplitude of the curve. 1 for speed = 0 km/h, rises to 4+ for speed = 100 km/h
	 */
	const amplitude = 1 + 3 * s;
	/**
	 * The width of the bell curve, not at any specific height, determined by trial and error
	 * Roughly 300 at speed = 0 km/h and 50-60 at speed = 100 km/h
	 */
	const width = Math.pow(10, speed / 100) / 100;

	return amplitude / Math.pow(Math.E, (width * direction) ** 2) + yShift;
};

/**
 * ----------------------- FUNCTIONS FROM ROTHERMEL -----------------------------
 */

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

/**
 * --------------------------- PERSONAL INVENTIONS ------------------------------
 */

/**
 * Alternative function which scales the nominal fire spread probability by wind and slope factors
 * @param nominalSpreadP Nominal Fire Spread Probability (Probability of spread based solely on ground cover)
 * @param alphaWind Wind factor
 * @param alphaSlope Slope factor
 * @param ffmcE Fine fuel moisture content effect
 * @returns Probability of fire spread from one Cell to another.  Unitless number between 0 and 1
 */
export const alternateProbabilityOfIgnition = (
	nominalSpreadP: number,
	alphaWind: number,
	alphaSlope: number,
	ffmcE: number = 0.3
): number => {
	return nominalSpreadP * alphaWind * alphaSlope * ffmcE;
};
