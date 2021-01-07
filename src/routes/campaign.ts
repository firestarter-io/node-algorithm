// POST /api/campaign

import { createDEM } from '../utils/createDEM';
import { getTopography } from '../utils/getTopography';

export const campaign = (req, res) => {
	console.log('Youre at the api/campaign post route');

	const { mapBounds, latlng, zoom } = req.body;

	// Send response via SSE to let user know that their campaign criteria was recieved

	// ----------------------------------------------------------
	// -    Data collection                                  ----
	// ----------------------------------------------------------

	// Get DEM tiles for map bounds
	mapBounds && createDEM(mapBounds);
	latlng && zoom && console.log(getTopography(latlng, zoom));

	res.send('good job ahole');
};
