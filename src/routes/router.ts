import * as express from 'express';
import { campaign } from './campaign';

const router = express.Router();

router.post('/api/campaign', campaign);

router.get('/api', (req, res) => {
	res.send('You hit the api route');
});

router.get('/', (req, res) => {
	res.send('You hit the home route');
});

export default router;
