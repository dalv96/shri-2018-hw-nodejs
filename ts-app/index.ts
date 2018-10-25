'use strict';

import express from 'express';
const app = express();

import bodyParser from 'body-parser';
import conf from './conf.json';

import router from './router';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router(app);

app.listen(conf.port, (err: string) => {
	if (err) {
		console.error('Server does not start: ', err);
	}
	console.log(`Server is listening on ${conf.port}`);
});
