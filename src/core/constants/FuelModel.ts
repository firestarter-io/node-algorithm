/*
 * Firestarter.io
 *
 * Copyright (C) 2021 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

/**
 * Interface describing a fuel model.  Forms basis of FuelModel13 and FuelModel40 interfaces
 */
export interface FuelModel {
	/**
	 * The code label for the fuel type, matches value for the key referencing the FuelModel
	 */
	label: string;
	/**
	 * The name / title of the fuel type
	 */
	name?: string;
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
	 * Bulk density, in lb/ft^2
	 */
	bulkDensity: number;
	/**
	 * Nonburnable status for nonburnable fuel types
	 */
	nonBurnable?: true;
	/**
	 * Relative packing ratio is a unitless ratio
	 *
	 * From [The Rothermel surface fire spread model and associated developments: A comprehensive explanation, 2018](https://www.fs.usda.gov/treesearch/pubs/55928)
	 */
	relativePackingRatio: number;
}
