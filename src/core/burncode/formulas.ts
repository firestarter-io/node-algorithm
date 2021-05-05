/**
 * Firestarter.io
 *
 * Mathematical formulas describing variousa aspects of fire spread
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
