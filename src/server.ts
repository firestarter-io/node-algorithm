import * as express from 'express';
import * as dotenv from 'dotenv';
import * as bp from 'body-parser';
import * as cors from 'cors';
import * as chalk from 'chalk';
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
const server = app.listen(port, () => {
	console.clear();
	console.log(chalk.blue(`\n\nFirestarter is listening on port ${port} 🎧\n`));
});

// Perform cleanup
process.on('SIGINT', function () {
	server.close(() => {
		console.log(chalk.blue('\n\nShutting down Firestarter'));

		process.exit();
	});
});
