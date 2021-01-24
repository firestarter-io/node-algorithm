import * as express from 'express';
import * as dotenv from 'dotenv';
import * as bp from 'body-parser';
import * as cors from 'cors';
import './config';
import router from './router';
import { EsriImageRequest } from './core/utils/esri-utils';
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

const landfireVCCRequest = (globalThis.landfireVCCRequest = new EsriImageRequest(
	{
		url:
			'https://landfire.cr.usgs.gov/arcgis/rest/services/Landfire/US_200/MapServer',
		exportType: 'export',
		f: 'image',
		format: 'png32',
		sr: '102100',
		sublayer: '30',
		dpi: '96',
	}
));

// Start server
app.listen(port, () => {
	console.log(`App is listening on port ${port}`);
});
