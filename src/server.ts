import * as express from 'express';
import * as dotenv from 'dotenv';
import * as bp from 'body-parser';
import * as cors from 'cors';
import '@config';
import router from './router';
dotenv.config();

// Set up app
const app = express();
const port: string = process.env.PORT || '4424';

// Set up middlewares
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cors());

// Set up routes
app.use('/', router);

// Start server
app.listen(port, () => {
	console.log(`App is listening on port ${port}`);
});
