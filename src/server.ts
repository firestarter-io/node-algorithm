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
 * Express server that serves the application
 */

import * as fs from 'fs';
import * as express from 'express';
import * as dotenv from 'dotenv';
import * as bp from 'body-parser';
import * as cors from 'cors';
import '~config';
import { PORT, PURGE_TILES, TILE_DIR } from '~config';
import router from './router';
import logger from '~core/utils/Logger';
dotenv.config();

// Set up app
const app = express();
const port: string = process.env.PORT ?? PORT;

// Set up middlewares
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cors());

// Set up routes
app.use('/', router);

// Start server
const server = app.listen(port, () => {
	logger.server(`Firestarter is listening on port ${port} 🎧\n`);
});

// Perform cleanup
process.on('SIGINT', function () {
	server.close(() => {
		logger.server('Shutting down Firestarter');
		if (PURGE_TILES) {
			fs.rmdirSync(TILE_DIR, { recursive: true });
			logger.server('🧹 Removing all tile images...');
		}
		logger.server('Goodbye!\n\n');
		process.exit();
	});
});
