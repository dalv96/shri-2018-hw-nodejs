'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const conf = require('./conf');

const router = require('./router');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router(app);

app.listen(conf.port, (err) => {
  if (err) {
    return console.log('Server does not start: ', err);
  }
  console.log(`Server is listening on ${conf.port}`);
});
