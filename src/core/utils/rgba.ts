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
 * Utility functions for working with RGBA values
 */

import { compareObjectWithTolerance } from './math';

/**
 * Utility class for working wit RGBA values
 */
export class RGBA {
	R: number;
	G: number;
	B: number;
	A: number;

	constructor(R: number, G: number, B: number, A: number) {
		this.R = R;
		this.G = G;
		this.B = B;
		this.A = A;
	}

	matches(RGBA, tolerance: number = 1): boolean {
		return compareObjectWithTolerance(
			{ R: this.R, G: this.G, B: this.B, A: this.A },
			RGBA,
			tolerance
		);
	}
}

/**
 * Takes in ImageData object (created when saving a tile to the store), and xy coordinate
 * of point on tile, returns RGBA value of that pixel from that ImageData's Uint8ClampedArray
 * @param {Object} imgData
 * @param {Number} x | x position of point on tile
 * @param {Number} y | y position of point on tile
 */
export function getRGBfromImgData(imgData: ImageData, x: number, y: number) {
	var index = y * imgData.width + x;
	var i = index * 4;
	var d = imgData.data;
	return new RGBA(d[i], d[i + 1], d[i + 2], d[i + 3]);
}
