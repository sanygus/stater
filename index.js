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

app.get('/state/:devid/:component', (req, res) => {
  db.addState(Object.assign({}, req.query, req.params));
  res.type('application/json').status(200).send({ok: true});
});

app.get('/webhook/:devid/:type', (req, res) => {
  const { url } = req.query;
  if (url) {
    db.addWebHook(Object.assign({}, { url }, req.params));
    res.type('application/json').status(200).send({ok: true});
  } else {
    res.type('application/json').status(400).send({ok: false});
  }
});

app.listen(options.port);

