'use strict';

var config = require('../../config');
var util = require('util');
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
    module.exports.logError(err, req.url);

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

module.exports.logError = function (err, url) 
{
    console.log(err.stack);
    err = null;
    // var meta = '[' + new Date() + '] ' + (url || "Background") + '\n';
    // errorLogStream.write(meta + err.stack + '\n');
};

// > var missingParameter = generate(400, 100102, 'Missing parameter:');
//
// > missingParameter(['phone', 'email']);
// { [Error: Missing parameter: phone email] status: 400, code: 100102 }
//
// > missingParameter('phone', 'email');”
// { [Error: Missing parameter: phone email] status: 400, code: 100102 }
//
// > missingParameter(['phone', 'email'].join(', '));
// { [Error: Missing parameter: phone, email] status: 400, code: 100102 }
module.exports.generateError = function (httpStatus, errorCode, message, isWarning)
{
    return function errorAPI()
    {
        var params = [message];
        var args = Array.prototype.slice.call(arguments);

        for (var i = 0; i < args.length; ++i)
        {
            if (!util.isArray(args[i])) {
                params.push(args[i]);
            } else {
                params = params.concat(args[i]);
            }
        }

        var error = new Error(util.format.apply(util, params));
        // console.log(error.stack);
        // error.stack = error.stack.split(/\n/g).splice(2).join('\n');
        // error.stack += error.
        error.status = httpStatus;
        error.code = errorCode;
        error.isWarning = !!isWarning;
        return error;
    };
};


process.on('uncaughtException', function (error)
{
    // console.error("uncaughtException ERROR" + error.stack);
    module.exports.logError(error);
});
