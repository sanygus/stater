const { MongoClient } = require('mongodb');
let db;
MongoClient.connect('mongodb://localhost:27017/state', function(err, dblink) {
  if (err) { console.error(err); }
  db = dblink;
});

module.exports.addEvent = (data) => {
  console.log(data);
  db.collection('events').insertOne(data);
}

module.exports.addState = (data) => {
  console.log(data);
  db.collection('state').insertOne(data);
}

module.exports.addWebHook = (data) => {
  console.log(data);
  db.collection('webhook').insertOne(data);
}

module.exports.searchWebHook = (params, callback) => {
  //params = { devid, type }
  db.collection('webhook').find(params, { _id: 0, url: 1} ).toArray(callback);
}