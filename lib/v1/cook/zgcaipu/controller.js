"use strict";

var error_handler = require('../../../utils/error_handler');
var _manager = require('../manager');
var manager = require('./manager');
var config = require('./config');
var _queue = config._queue;

function startSpiderUrl () 
{
	setInterval(function () {_manager.spiderUrl(_queue.queue_seeds, _queue.queue_analy);}
	, 1000);
};

function startAnalyUrl () 
{
	setInterval(function () { manager.analyUrl();}
	, 1000);
};

function saveSeeds () 
{
	setInterval(function () 
	{
		manager.saveSeeds(function (err, ret) 
		{
			if (err) {
				error_handler.logError(err);
				return;
			}

			ret = null;
		});
	}, 6*60*60*1000);
};

function saveAnaly () 
{
	setInterval(function () 
	{
		manager.saveAnaly(function (err, ret) 
		{
			if (err) {
				error_handler.logError(err);
				return;
			}

			ret = null;
		});
	}, 6*60*60*1000);
};

function saveRecipes () 
{
	setInterval(function () 
	{
		manager.saveRecipes();
	}, 10*1000);
};

function getSeeds (callback) 
{
	manager.getSeeds(function (err, ret) 
	{
		if (err) {
			return callback(err);
		}

		if (ret[0]) {
			_queue.queue_seeds = ret[0];
			_manager.clearQueue(_queue.queue_seeds);
		}
		console.log("zgcaipu-seeds: " + _queue.queue_seeds.offset + "/" + _queue.queue_seeds.queue.length);
		return callback(null, true);
	});
};

function getAnaly (callback) 
{
	manager.getAnaly(function (err, ret) 
	{
		if (err) {
			return callback(err);
		}

		if (ret[0]) {
			_queue.queue_analy = ret[0];
			_manager.clearQueue(_queue.queue_analy);
		}
		console.log("zgcaipu-analy: " + _queue.queue_analy.offset + "/" + _queue.queue_analy.queue.length);
		return callback(null, true);
	});
};

function showMessage ()
{
	setInterval(function ()
	{
		console.log("~~~~zgcaipu~~~~");
		console.log("Recipes：" + (_queue.recipes.count - _queue.recipes.array.length)+ '/' +_queue.recipes.count);
		console.log("  Seeds：" + _queue.queue_seeds.offset + '/' + _queue.queue_seeds.queue.length);
		console.log("  Analy：" + _queue.queue_analy.offset + '/' + _queue.queue_analy.queue.length);
	}, 60*1000);
};

module.exports.startSpiderUrl = startSpiderUrl;
module.exports.startAnalyUrl = startAnalyUrl;
module.exports.saveRecipes = saveRecipes;
module.exports.showMessage = showMessage;
module.exports.saveSeeds = saveSeeds;
module.exports.saveAnaly = saveAnaly;
module.exports.getSeeds = getSeeds;
module.exports.getAnaly = getAnaly;
