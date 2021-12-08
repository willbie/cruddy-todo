const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promises = require('bluebird');

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
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      return callback(err)
    } else {
      var data = _.map(files, (file) => {
        var id = path.basename(file, '.txt')
        var filepath = path.join(exports.dataDir, file);
        return readFileSync(filepath).then((fileData) => {
          return {
            id: id,
            text: fileData.toString()
          };
        });
      });
      Promises.all(data).then((items => {
        callback(null, items);
      }))
    }
  })
};

var readFileSync = (filepath) => {
  return new Promises ((resolve, reject) => {
    fs.readFile(filepath, (err, fileData) => {
      if (err) {
        reject(err);
      } else {
        resolve(fileData);
      }
    })
  });
}


exports.readOne = (id, callback) => {
  var path = exports.dataDir + '/' + id.toString() + '.txt';
  fs.readFile(path, 'utf8', (err, fileData) =>{
    if (err) {
      callback(err);
    } else {
      items.id = id;
      items.text = fileData;
      callback(null, items);
    }
  });

  /*var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }*/
};

exports.update = (id, text, callback) => {
  var path = exports.dataDir + '/' + id.toString() + '.txt';
  fs.readFile(path, 'utf8', (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(path, text, (err) => {
        if (err) {
          throw 'WILL YOU SUCK';
        } else {
          callback(null, text);
        }
      });
    }
  });
  /*var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }*/
};

exports.delete = (id, callback) => {
  var path = exports.dataDir + '/' + id.toString() + '.txt';
  fs.readFile(path, 'utf8', (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      fs.unlink(path, (err) => {
        if (err) {
          throw err;
        } else {
          callback(err);
        }
      });
    }
  });
  /*var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }*/
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
