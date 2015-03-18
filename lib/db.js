"use strict";

var mongoskin = require('mongoskin');
var config = require('../config');

var mongoOpts = {
    numberOfRetries: 1,
    retryMiliSeconds: 500,
    safe: true,
    native_parser: true,
    readPreference: mongoskin.ReadPreference.SECONDARY_PREFERRED
};
var db = null;

module.exports.getCollection = function (collectionName) {
    if (!db) {
        db = mongoskin.db(config.mongo.spider_cook.url + '?auto_reconnect=true&poolSize=3',
            mongoOpts,
            { socketOptions: { timeout: 5000 } }
        );
    }
    return db.collection(collectionName);
};

module.exports.getDb = function () {
    if (!db) {
        db = mongoskin.db(config.mongo.spider_cook.url + '?auto_reconnect=true&poolSize=3',
            mongoOpts,
            { socketOptions: { timeout: 5000 } }
        );
    }
    return db;
};

module.exports.ObjectID = mongoskin.ObjectID;
module.exports.toObjectID = mongoskin.helper.toObjectID;