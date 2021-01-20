/**
 * Firestarter.io
 *
 * Type definition for esri related functions and utils
 */

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
}
