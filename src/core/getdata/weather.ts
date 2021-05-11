/**
 * Firestarter.io
 *
 * Functions to get weather forecasts and historical data
 * Needed for weather, humidity, temperature, etc
 */

import { LatLngLiteral } from 'leaflet';
import fetch from 'node-fetch';

interface WeatherForecast {
	cloudcover: number;
	conditions: string;
	datetime: string;
	datetimeEpoch: number;
	description: number;
	dew: number;
	feelslike: number;
	feelslikemax: number;
	feelslikemin: number;
	humidity: number;
	icon: string;
	moonphase: number;
	precip: number;
	precipcover: null;
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
	sunrise: string;
	sunriseEpoch: number;
	sunset: string;
	sunsetEpoch: number;
	temp: number;
	tempmax: number;
	tempmin: number;
	uvindex: number;
	visibility: number;
	winddir: number;
	windgust: number;
	windspeed: number;
}

interface WeatherForecastResponse {
	address: string;
	alerts: any[];
	currentConditions: any; // NA
	days: WeatherForecast & { hours: WeatherForecast[] }[];
	description: string;
	latitude: number;
	longitude: number;
	queryCost: number;
	resolvedAddress: string;
	stations: any; // NA
	timezone: string;
	tzoffset: number;
}

/**
 * API call to get weather
 * @param latlng | LatLng location of forecast / historyical date
 */
export const getWeather = async (
	latlng: L.LatLng | LatLngLiteral
): Promise<WeatherForecastResponse> => {
	const key = process.env.VISUALCROSSING_KEY;
	const { lat, lng } = latlng;
	const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lng}?key=${key}`;

	return fetch(url)
		.then((r) => r.json())
		.then((r) => console.log(r));
};