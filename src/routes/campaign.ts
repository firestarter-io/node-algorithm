// POST /api/campaign

import { createDEM } from '../utils/createDEM';
import { getTopography } from '../utils/getTopography';

export const campaign = async (req, res) => {
	const { mapBounds, latlng, zoom } = req.body;

	// Send response via SSE to let user know that their campaign criteria was recieved

	// ----------------------------------------------------------
	// -    Data collection                                  ----
	// ----------------------------------------------------------

	// Get DEM tiles for map bounds
	mapBounds && createDEM(mapBounds);
	const topo = await getTopography(latlng);
	latlng && zoom && console.log(topo);

	res.send('good job ahole');
};
