const app = require('express')();
const request = require('request');
const options = require('./options');
const db = require('./db');
const wake = {};

app.get('/event/:devid/:event', (req, res) => {
  req.params.devid = parseInt(req.params.devid);
  db.addEvent(Object.assign({ recDate: new Date().toJSON() }, req.query, req.params));
  if (req.params.event === 'sleep' && wake[req.params.devid]) {
    wake[req.params.devid] = false;
  }
  res.type('application/json').status(200).send({ok: true});
  db.searchWebHook(req.params, (err, urlsarr) => {
    for (let urlobj of urlsarr) {
      request.get(urlobj.url);
    }
  });
});

app.get('/heartbeat/:devid/:component', (req, res) => {
  req.params.devid = parseInt(req.params.devid);
  if (req.query.charge !== undefined) { req.query.charge = parseFloat(req.query.charge); }
  db.addHB(Object.assign({ recDate: new Date().toJSON() }, req.query, req.params));
  if (req.params.component === "ard") {
    let action = 0;
    if (wake[req.params.devid]) {
      action = 1;
      wake[req.params.devid] = false;
    }
    res.type('text/plain').status(200).send(action.toString());
  } else {
    res.type('application/json').status(200).send({ok: true});
  }
});

app.get('/wake/:devid', (req, res) => {
  req.params.devid = parseInt(req.params.devid);
  wake[req.params.devid] = true;
  res.type('application/json').status(200).send({ok: true});
});

app.listen(options.port);
