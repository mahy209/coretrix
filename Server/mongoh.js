var lib = require('./library');
var defParam = lib.defParam
var ObjectId = require('mongodb').ObjectID;

module.exports = {
  ConvertArrayToOr: function (field, arr) {
    var selector = [];
    if (!arr || arrayOrObject(arr) != 'array' || arr.length <= 0) return [];
    for (var i = 0; i < arr.length; i++) {
      var element = arr[i];
      var pushed = {};
      pushed[field] = element;
      selector.push(pushed);
    }
    return selector;
  },
  ObjectIdDate: function (objectId) {
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
  },
  ObjectIdConverter: function (obj) {
    return ObjectId(obj);
  },
  /**
   * Increment a certain field in a collection
   * @param  {[Database]}   db       [MongoDB Database]
   * @param  {String}   col      Collection Name
   * @param  {Object}   rules    [Selection Rules]
   * @param  {String}   id       [Field Name]
   * @param  {Function}   init     [Incrementer]
   * @param  {Function} callback [description]
   */
  GetNextSequence: function (db, col, rules, id, init, callback, syncVar) {
    let s = syncVar;
    var last = db.collection(col).find(rules, {
      _id: 0,
      [id]: 1
    }).sort({
      [id]: -1
    }).limit(1).toArray(function (err, result) {
      if (err) throw err;
      if (!result || result.length <= 0 || Object.keys(result[0]).length <= 0) callback(init(null, true), s);
      else callback(init(parseInt(result[0][id])), s);
    });
  },
  Exists: function (db, col, rules, callback, getdata) {
    getdata = defParam(getdata, true);
    db.collection(col).findOne(rules, getdata ? ((typeof getdata == 'boolean') ? {} : getdata) : {
      _id: 1
    }, function (err, result) {
      if (err) throw err;
      if (result) callback(result);
      else callback(false);
    });
  },
  GetLastDocument: function (db, col, callback) {
    var last = db.collection(col).find(null, {
      "_id": 0,
      "date": 1
    }).limit(1).sort({
      $natural: -1
    }).toArray(function (err, result) {
      if (err) throw err;
      if (!result || result.length <= 0) callback(false);
      else callback(result[0]);
    });
  },
  GetIDsValues: function (db, col, filter, ids, callback) {
    db.collection(col).find({
      _id: {
        "$in": ids
      }
    }, filter).toArray(function (err, result) {
      callback(lib.ArrayToObject(result.sort(getComparator(lib.ConvertArray(ids, lib.StringConverter), "_id")), "_id"));
    });
  },
  ValidateIDs: function (db, col, ids, callback) {

  },
  GetDocuments: function (db, col, rules, exinclude, startid, limit, callback) {
    db.collection(col).find(Object.assign({
      "id": {
        $gt: startid
      }
    }, rules), exinclude).limit(limit).toArray(function (err, result) {
      if (err) throw err;
      else callback(result);
    });
  }
}