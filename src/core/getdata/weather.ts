/**
 * Firestarter.io
 *
 * Functions to get weather forecasts and historical data
 * Needed for weather, humidity, temperature, etc
 */

import { LatLngLiteral } from 'leaflet';
import fetch from 'node-fetch';
import mockweather from '@core/constants/mockweather';

export interface WeatherForecast {
	cloudcover: number;
	conditions: string;
	datetime: string;
	datetimeEpoch: number;
	description?: string;
	dew: number;
	feelslike: number;
	feelslikemax?: number;
	feelslikemin?: number;
	/**
	 * Relative humidity the amount of water vapor present in the air compared the maximum amount
	 * possible for a given temperature, expressed as a mean percentage. Human comfort
	 * levels are typically found between 30-70%. Values higher than 70% are considered humid.
	 * Values lower than 30% are considered dry.
	 */
	humidity: number;
	icon: string;
	moonphase?: number;
	precip: number;
	precipcover?: null;
	precipprob: number;
	preciptype: null;
	pressure: number;
	severerisk: number;
	snow: number;
	snowdepth: number;
	solarenergy: number;
	solarradiation: number;
	source: string;
	stations: string[];
	sunrise?: string;
	sunriseEpoch?: number;
	sunset?: string;
	sunsetEpoch?: number;
	temp: number;
	tempmax?: number;
	tempmin?: number;
	uvindex: number;
	visibility: number;
	/**
	 * In degrees, clockwise from 0 deg N, coming FROM the degree listed
	 */
	winddir: number;
	/**
	 * Wind speed average over 20 seconds, in km/h when using ?unitGroup=metric
	 */
	windgust: number;
	/**
	 * Wind speed average over 2 minutes, in km/h when using ?unitGroup=metric
	 */
	windspeed: number;
}

type TotalForecast = WeatherForecast & { hours: WeatherForecast[] };

interface WeatherForecastResponse {
	address: string;
	alerts?: any[];
	currentConditions?: any; // NA
	days: TotalForecast[];
	description?: string;
	latitude: number;
	longitude: number;
	queryCost: number;
	resolvedAddress: string;
	stations?: any; // NA
	timezone: string;
	tzoffset: number;
}

export interface WeatherByTheHour {
	[key: number]: WeatherForecast;
}

const baseurl =
	'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

/**
 * API call to get weather, default of 2 week forecast, daily and hourly data
 *
 * Currently using [weather.visualcrossing.com](weather.visualcrossing.com)
 *
 * @param latlng | LatLng location of forecast / historyical date
 */
export const fetchWeather = async (
	latlng: L.LatLng | LatLngLiteral
): Promise<WeatherForecastResponse> => {
	const key = process.env.VISUALCROSSING_KEY;
	const { lat, lng } = latlng;
	const url = `${baseurl}/${lat},${lng}?unitGroup=metric&key=${key}`;

	return fetch(url)
		.then((r) => r.json())
		.then((r) => console.log(r));
};

/**
 * API call to get weather, custom timerange, daily and hourly forecast
 *
 * Currently using [weather.visualcrossing.com](weather.visualcrossing.com)
 *
 * ## Watch out!  This costs money!
 * ## Using dummy data for now!
 *
 * @param latlng | LatLng location of forecast / historyical date
 * @param startTime | Unix timestamp of start time, in seconds, not miliseconds
 * @param endTime | Unix timestamp of end time, in seconds, not miliseconds
 */
export const fetchWeatherRange = async (
	latlng: L.LatLng | LatLngLiteral,
	startTime: number,
	endTime: number
): Promise<WeatherForecastResponse> => {
	const key = process.env.VISUALCROSSING_KEY;
	const { lat, lng } = latlng;
	const url = `${baseurl}/${lat},${lng}/${startTime}/${endTime}?unitGroup=metric&key=${key}`;

	try {
		// DEV ▼
		throw new Error('Skipping weather API call, using mock data');
		// DEV ▲

		return fetch(url)
			.then((r) => r.json())
			.then((r) => console.log(r));
	} catch (e) {
		return mockweather;
	}
};

/**
 * Function to extract the hours of the weather forecast from the days and return a flattened array of hours
 * @param forecast | WeatherForecastResponse - the total response of the forecast
 */
export const flattenWeatherHours = (
	forecast: WeatherForecastResponse
): WeatherByTheHour => {
	const flattened = forecast.days.map((day) => day.hours).flat();
	return flattened.reduce(function (acc, curr) {
		acc[curr.datetimeEpoch] = curr;
		return acc;
	}, {});
};
