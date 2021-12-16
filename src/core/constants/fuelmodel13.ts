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
		label: 'FBFM1',
		name: 'Short grass (1 foot)',
		description:
			'Fire spread is governed by the fine, very porous, and continuous herbaceous fuels that have cured or are nearly cured. Fires are surface fires that move rapidly through the cured grass and associated material. Very little shrub or timber is present, generally less than onethird of the area. Grasslands and savanna are represented along with stubble, grass-tundra, and grass-shrub combinations that met the above area constraint. Annual and perennial grasses are included in this fuel model. Refer to photographs 1, 2, and 3 for illustrations.',
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
		label: 'FBFM2',
		name: 'Timber (grass and understory)',
		description:
			'Fire spread is primarily through the fine herbaceous fuels, either curing or dead. These are surface fires where the herbaceous material, in addition to litter and deaddown stemwood from the open shrub or timber overstory, contribute to the fire intensity. Open shrub lands and pine stands or scrub oak stands that cover one-third to two-thirds of the area may generally fit this model; such stands may include clumps of fuels that generate higher intensities and that may produce firebrands. Some pinyon-juniper may be in this model. Photographs 4 and 5 illustrate possible fuel situations.',
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
		label: 'FBFM3',
		name: 'Tall grass (2.5 feet)',
		description:
			'Fires in this fuel are the most intense of the grass group and dislay high rates of spread under the influence of wind. Wind may drive fire into the upper heights of the grass and across standing water. Stands are tall, averaging about 3 feet (1 m), but considerable variation may occur. Approximately one-thrid of more of the stand is considered dead or cured and maintains the fire. Wild or cultivated grains that have not been harvested can be considered similar to tall prairie and marshland grasses. Refer to photographs 6, 7, and 8 for examples of fuels fitting this model. This fuel correlates to 1978 NFDRS fuel model N.',
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
		label: 'FBFM4',
		name: 'Chaparral (6 feet)',
		description:
			'Fires intensity and fast-spreading fires involve the foliage and live and dead fine woody material in the crowns of a nearly continuous secondary overstory. Stands of mature shrubs, 6 or more feet tall, such as California mixed chaparral, the high pocosin along the east coast, the pinebarrens of New Jersey, or the closed jack pine stands of the north-central States are typical candidates. Besides flammable foliage, dead woody material in the stands significantly contributes to the fire intensity. Height of stands qualifying for this model depends on local conditions. A deep litter layer may also hamper suppression efforts. Photographs 9, 10, 11, and 12 depict examples fitting this fuel model. This fuel model represents 1978 NFDRS fuel models B and O; fire behavior estimates are more severe than obtained by models B or O.',
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
		label: 'FBFM5',
		name: 'Brush (2 feet)',
		description:
			'Fire is generally carried in the surface fuels that are made up of litter cast by the shrubs and the grasses or forbs in the understory. The fires are generally not very intense because surface fuel loads are light, the shrubs are young with little dead material, and the foliage contains little volatile material. Usually shrubs are short and almost totally cover the area. Young, green stands with no dead wood would qualify: laurel, vine maple, alder, or even chaparral, manzanita, or chamise. No 1978 NFDRS fuel model is represented, but model 5 can be considered as a second choice for NFDRS model D or as a third choice for NFDRS model T. Photographs 13 and 14 show field examples of this type. Young green stands may be up to 6 feet (2 m) high but have poor burning properties because of live vegetation.',
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
		label: 'FBFM6',
		name: 'Dormant brush, hardwood slash',
		description:
			'Fires carry through the shrub layer where the foliage is more flammable than fuel model 5, but this requires moderate winds, greater than 8 mi/h (13 km/h) at midflame height. Fire will drop to the ground at low wind speeds or at openings in the stand. The shrubs are older, but not as tall as shrub types of model 4, nor do they contain as much fuel as model 4. A broad range of shrub conditions is covered by this model. Fuel situations to be considered include intermediate stands of chamise, chaparral, oak brush, low pocosin, Alaskan spruce taiga, and shrub tundra. Even hardwood slash that has cured can be considered. Pinyon-juniper shrublands may be represented but may overpredict rate of spread except at high winds, like 20 mi/h (32 km/h) at the 20-foot level. The 1978 NFDRS fuel models F and Q are represented by this fuel model. It can be considered a second choice for models T and D and a third choice for model S. Photographs 15, 16, 17, and 18 show situations encompassed by this fuel model.',
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
		label: 'FBFM7',
		name: 'Southern rough',
		description:
			'Fires burn through the surface and shrub strata with equal ease and can occur at higher dead fuel moisture contents because of the flammability of live foliage and other live material. Stands of shrubs are generally between 2 and 6 feet (0.6 and 1.8 m) high. Palmetto-gallberry understory-pine overstory sites are typical and low pocosins may be represented. Black spruce-shrub combinations in Alaska may also be represented. This fuel model correlates with 1978 NFDRS model D and can be a second choice for model Q. Photographs 19, 20, and 21 depict field situations for this model.',
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
		label: 'FBFM8',
		name: 'Closed timber litter',
		description:
			'Slow-burning ground fires with low flame lengths are generally the case, although the fire may encounter an occasional “jackpot” or heavy fuel concentration that can flare up. Only under severe weather conditions involving high temperatures, low humidities, and high winds do the fuels pose fire hazards. Closed canopy stands of short-needle conifers or hardwoods that have leafed out support fire in the compact litter layer. This layer is mainly needles, leaves, and occasionally twigs because little undergrowth is present in the stand. Representative conifer types are white pine, and lodgepole pine, spruce, fir, and larch. This model can be used for 1978 NFDRS fuel models H and R. Photographs 22, 23, and 24 illustrate the situations representative of this fuel.',
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
		label: 'FBFM9',
		name: 'Hardwood litter',
		description:
			'Fires run through the surface litter faster than model 8 and have longer flame height. Both long-needle conifer stands and hardwood stands, especially the oak-hickory types, are typical. Fall fires in hardwoods are predictable, but high winds will actually cause higher rates of spread than predicted because of spotting caused by rolling and blowing leaves. Closed stands of long-needled pine like ponderosa, Jeffrey, and red pines, or southern pine plantations are grouped in this model. Concentrations of dead-down woody material will contribute to possible torching out of trees, spotting, and crowning.',
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
		label: 'FBFM10',
		name: 'Timber (litter and understory)',
		description:
			'The fires burn in the surface and ground fuels with greater fire intensity than the other timber litter models. Dead-down fuels include greater quantities of 3-inch (7.6-cm) or larger Iimbwood resulting from overmaturity or natural events that create a large load of dead material on the forest floor. Crowning out, spotting, and torching of individual trees are more frequent in this fuel situation, leading to potential fire control difficulties. Any forest type may be considered if heavy down material is present; examples are insect- or disease-ridden stands, windthrown stands, overmature situations with deadfall, and aged light thinning or partial-cut slash. The 1978 NFDRS fuel model G is represented and is depicted in photographs 28, 29, and 30.',
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
		label: 'FBFM11',
		name: 'Light logging slash',
		description:
			'Fires are fairly active in the slash and herbaceous material intermixed with the slash. The spacing of the rather light fuel load, shading from overstory, or the aging of the fine fuels can contribute to limiting the fire potential. Light partial cuts or thinning operations in mixed conifer stands, hardwood stands, and southern pine harvests are considered. Clearcut operations generally produce more slash than represented here. The less-than-3-inch (7.6-cm) material load is less than 12 tons per acre (5.4 t/ha). The greater-than-3-inch (7.6-cm) is represented by not more than 10 pieces, 4 inches (10.2 cm) in diameter, along a 50-foot (15-m) transect.',
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
		label: 'FBFM12',
		name: 'Medium logging slash',
		description:
			'Rapidly spreading fires with high intensities capable of generating firebrands can occur. When fire starts, it is generally sustained until a fuel break or change in fuels is encountered. The visual impression is dominated by slash and much of it is less than 3 inches (7.6 cm) in diameter. The fuels total less than 35 tons per acre (15.6 t/ha) and seem well distributed. Heavily thinned conifer stands, clearcuts, and medium or heavy partial cuts are represented. The material larger than 3 inches (7.6 cm) is represented by encountering 11 pieces, 6 inches (15.2 cm) in diameter, along a 50-foot (15-m) transect.',
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
		label: 'FBFM13',
		name: 'Heavy logging slash',
		description:
			'Fire is generally carried across the area by a continuous layer of slash. Large quantities of material larger than 3 inches (7.6 cm) are present. Fires spread quickly through the fine fuels and intensity builds up more slowly as the large fuels start burning. Active flaming is sustained for long periods and a wide variety of firebrands can be generated. These contribute to spotting problems as the weather conditions become more severe. Clearcuts and heavy partial-cuts in mature and overmature stands are depicted where the slash load is dominated by the greater-than-3-inch (7.6-cm) diameter material. The total load may exceed 200 tons per acre (89.2 t/ha) but fuel less than 3 inches (7.6-cm) is generally only 10 percent of the total load. Situations where the slash still has “red” needles attached but the total load is lighter, more like model 12, can be represented because of the earlier high intensity and quicker area involvement. The 1978 NFDRS fuel model I is represented and is illustrated in photographs 37 and 38 Areas most commonly fitting this model are old-growth stands west of the Cascade and Sierra Nevada Mountains. More efficient utilization standards are decreasing the amount of large material left in the field.',
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
		label: 'Urban',
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
		label: 'Snow/Ice',
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
		label: 'Agriculture',
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
		label: 'Water',
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
		label: 'Barren',
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
		label: 'NoData',
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
