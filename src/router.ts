/*
 * Firestarter.io
 *
 * Copyright (C) 2020 Blue Ohana, Inc.
 * All rights reserved.
 * The information in this software is subject to change without notice and
 * should not be construed as a commitment by Blue Ohana, Inc.
 *
 */

import * as express from 'express';
import { campaign } from './controllers/campaign';
import { restart } from './controllers/restart';

const router = express.Router();

router.post('/api/campaign', campaign);

router.get('/api/restart', restart);

router.get('/api', (req, res) => {
	res.send('You hit the api route');
});

router.get('/', (req, res) => {
	res.send('You hit the home route');
});

export default router;
