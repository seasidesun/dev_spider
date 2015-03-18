"use strict";

var errorHandler = require('../lib/utils/error_handler');
var userRounter = require('../lib/v1/user/router');
var cookRounter = require('../lib/v1/cook/router');

module.exports = function (app) {

    app.get('/ping', function (req, res, next) { res.send("ok"); });

    app.use('/user', userRounter);
    app.use('/cook', cookRounter);

    // 404 handler
    app.use(errorHandler.handler404);
    
    // Error handler
    app.use(errorHandler.errorHandler);
};
