/*
 * Firestarter.io
 *
 * Copyright (C) 2022 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

/**
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
