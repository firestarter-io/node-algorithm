/**
 * Firestarter.io
 *
 * Type definition for esri related functions and utils
 */

import { ImageDataCache } from '@data';

export interface ImageRequestOptions {
	exportType?: 'export';
	token?: string;
	format?: string;
	f?: string;
	renderingRule?: any;
	mosaicRule?: any;
	sr?: string;
	sublayer?: string;
	dpi?: string;
	dataCache: ImageDataCache;
}
