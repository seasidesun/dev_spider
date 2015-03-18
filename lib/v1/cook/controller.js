"use strict";

var error_handler = require('../../utils/error_handler');
var duoguoControl = require('./douguo/controller');
var manager = require('./manager');
var async = require('async');

async.parallel(
	[
		function (callback) {duoguoControl.getSeeds(callback);},
		function (callback) {duoguoControl.getAnaly(callback);}
	],
	function (err) {
		if (err) {
			error_handler.logError(err);
			return;
		}
		setTimeout(duoguoControl.startSpiderUrl, 1000);
		setTimeout(duoguoControl.startAnalyUrl, 2000);
		setTimeout(duoguoControl.saveRecipes, 0);
		setTimeout(duoguoControl.saveSeeds, 0);
		setTimeout(duoguoControl.saveAnaly, 0);
		setTimeout(duoguoControl.showMessage, 0);
	}
);



