const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, counter) =>{
    if (err) {
      throw ('Sorry u failed');
    } else {
      items.id = counter;
      items.text = text;
      var pathId = exports.dataDir + '/' + items.id.toString() + '.txt';
      fs.writeFile(pathId, text, (err) => {
        if (err) {
          throw ('error writing data');
        } else {
          callback(null, items);
        }
      });
    }
  });
  //callback(null, {id, text})
  // { id text } === {id: text}
};

exports.readAll = (callback) => {
  console.log(items);

  //var data = _.map(items, (text, id) => {
  //  return { id, text };
  //});
  //callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
