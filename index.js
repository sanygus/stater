const app = require('express')();
const request = require('request');
const options = require('./options');
const db = require('./db');

app.get('/event/:devid/:type', (req, res) => {
  db.addEvent(Object.assign({}, req.query, req.params));
  res.type('application/json').status(200).send({ok: true});
  db.searchWebHook(req.params, (err, urlsarr) => {
    for (let urlobj of urlsarr) {
      request.get(urlobj.url);
    }
  });
});

app.get('/heartbeat/:devid/:component', (req, res) => {
  db.addHB(Object.assign({}, req.query, req.params));
  res.type('application/json').status(200).send({ok: true});
});

app.listen(options.port);

