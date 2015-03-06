'use strict';

var config = require('../../config');
var fs = require('fs');

var errorLogStream = fs.createWriteStream(__dirname + '/../..' + config.express.error_path, {flags: 'a'});

// catch 404 and forward to error handler
module.exports.handler404 = function (req, res, next)
{
    var error = new Error('Not Found: "' + req.originalUrl + '"');
    error.status = 404;
    error.code = 404;
    next(error);
};

// error handler
module.exports.errorHandler = function (err, req, res, next)
{
    console.log(err.stack);
    var meta = '[' + new Date() + '] ' + req.url + '\n';
    errorLogStream.write(meta + err.stack + '\n');

    if (config.express.env === 'development') {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    } else {
        delete err.stack;
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    }
};

process.on('uncaughtException', function (error)
{
    console.error("uncaughtException ERROR" + error);
});
