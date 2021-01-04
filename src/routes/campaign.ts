// POST /api/campaign

import { createDEM } from '../utils/createDEM';

export const campaign = (req, res) => {
	console.log('Youre at the api/campaign post route');

	const { mapBounds } = req.body;

	// Send response via SSE to let user know that their campaign criteria was recieved

	// ----------------------------------------------------------
	// -    Data collection                                  ----
	// ----------------------------------------------------------

	// Get DEM tiles for map bounds
	createDEM(req.body.mapBounds);

	res.send('good job ahole');
};
