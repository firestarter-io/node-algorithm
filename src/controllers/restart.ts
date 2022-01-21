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
 * Route to restart server programatically with PM2
 */

import * as pm2 from 'pm2';
import logger from '@core/utils/Logger';

export const restart = (req, res) => {
	console.log('⟳ Restarting firestarter from within code');
	res.send('Restarting server');
	pm2.reload('firestarter', err => {
		logger.error(err);
	});
};
