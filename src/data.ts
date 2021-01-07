// In memory data for a given user session

export const tiles: { [key: string]: ImageData } = {};
// @ts-ignore
global.tiles = tiles;
