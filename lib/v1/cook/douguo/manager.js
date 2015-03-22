"use strict";

var error_handler = require('../../../utils/error_handler');
var _manager = require('../manager');
var model = require('./model');
var _queue = require('./config')._queue;

module.exports.analyUrl = function () 
{
	// var url_analy = q_analy.queue.slice(q_analy.offset, q_analy.offset + q_analy.limit);
	var url_analy = _queue.queue_analy.queue.slice(_queue.queue_analy.offset, _queue.queue_analy.offset + _queue.queue_analy.limit);
	_queue.queue_analy.offset += url_analy.length;
	// console.log(url_analy.length);

	for (var i = url_analy.length - 1; i >= 0; i--) 
	{
		// exsit error url like "cookbook/1068296/alldish", skip it
		if (url_analy[i].indexOf("html") != -1) 
		{
			_manager.httpGet(url_analy[i], function (err, html, src_url)
			{
				// if (html) html = null;
				if (err) {
					_queue.queue_analy.queue.push(err.src_url);
					error_handler.logError(err);

					err = null;
				} else {
					getRecipeFromHtml(html, src_url);

					html = null;
					src_url = null;
				}
			});
		}
	};

	url_analy = null;
	return;
};

function getRecipeFromHtml (html, url) 
{
	var recipe = {
		recipeUrl: url
	};
	var offset_s = 0;
	var offset_e = 0;

	//get name through "<h1" 
	// console.log("get name");
	var name = null;
	offset_s = html.indexOf("<h1", offset_e);
	if (offset_s != -1) {

		offset_s = html.indexOf(">", offset_s);
		if (offset_s != -1) {

			offset_e = html.indexOf("</h1>", offset_s);
			if (offset_e !=-1) {

				name = html.slice(offset_s + 1, offset_e);
			}
		}
	}
	recipe.name = name;
	name = null;

	++offset_e;
	//get imgUrl through 'rel="recipe_img"'
	// console.log("get imgUrl");
	var imgUrl = null;
	offset_s = html.indexOf('rel="recipe_img"', offset_e);
	if (offset_s != -1) {

		offset_s = html.indexOf('href="', offset_s);
		if (offset_s != -1) {

			offset_s += 6;
			offset_e = html.indexOf('"', offset_s);
			if (offset_e != -1) {

				imgUrl = html.slice(offset_s, offset_e);
			}
		}
	}
	recipe.imgUrl = imgUrl;
	imgUrl = null;

	++offset_e;
	//get lookNum
	// console.log("get lookNum");
	var lookNum = 0;
	offset_s = html.indexOf("浏览", offset_e);
	if (offset_s != -1) {

		offset_s = html.indexOf(">", offset_s - 20);
		if (offset_s != -1) {

			offset_e = html.indexOf("<", offset_s);
			if (offset_e != -1) {

				var lookNum = html.slice(offset_s + 1, offset_e);
				lookNum = parseInt(lookNum) || 0;
			}
		}
	}
	recipe.lookNum = lookNum;
	lookNum = null;

	++offset_e;
	//get collectsNum through id "collectsnum"
	// console.log("get collectsNum");
	var collectsNum = 0;
	offset_s = html.indexOf("collectsnum", offset_e);
	if (offset_s != -1) {

		offset_s = html.indexOf(">", offset_s);
		if (offset_s != -1) {

			offset_e = html.indexOf("<", offset_s);
			if (offset_e != -1) {

				var collectsNum = html.slice(offset_s + 1, offset_e);
				collectsNum = parseInt(collectsNum) || 0;
			}
		}
	}
	recipe.collectsNum = collectsNum;
	collectsNum = null;

	++offset_s;
	//get tag through class "btnta"
	var tag = "";
	do {
		offset_s = html.indexOf("btnta", offset_s);
		if (offset_s != -1) {

			offset_s = html.indexOf(">", offset_s);
			if (offset_s != -1) {

				offset_e = html.indexOf("<", offset_s);
				if (offset_e != -1) {

					tag += html.slice(offset_s + 1, offset_e) + ",";
				}
			}
		} else {
			break;
		}
	}while(offset_s != -1)
	recipe.tag = tag;
	tag = null;

	_queue.recipes.array.push(recipe);
	_queue.recipes.count++;

	offset_s = null;
	offset_e = null;
	recipe = null;
	html = null;
	url = null;
	return;
};

module.exports.saveRecipes = function () 
{
	var arrayToInsert = _queue.recipes.array.slice(_queue.recipes.offset, _queue.recipes.offset + _queue.recipes.limit);
	var date = new Date();

	for (var i = arrayToInsert.length - 1; i >= 0; i--) {
		delete arrayToInsert[i]._id;
		arrayToInsert[i].createAt = date;
	};

	model.saveRecipes(arrayToInsert, function (err) 
	{
		if (err) {
			error_handler.logError(err);

			err = null;
			arrayToInsert = null;
			return;
		}

		console.log("Save recipes(douguo):" + arrayToInsert.length);
		var gc = _queue.recipes.array.splice(_queue.recipes.offset, arrayToInsert.length);

		gc = null;
		arrayToInsert = null;
		return;
	});
};

module.exports.saveSeeds = function (callback) 
{
	delete _queue.queue_seeds._id;
	_queue.queue_seeds.createAt = new Date();

	model.insertSeeds(_queue.queue_seeds, callback);
};

module.exports.saveAnaly = function (callback) 
{
	delete _queue.queue_analy._id;
	_queue.queue_analy.createAt = new Date();

	model.insertAnaly(_queue.queue_analy, callback);
};

module.exports.getSeeds = function (callback) 
{
	model.getSeeds(callback);
};

module.exports.getAnaly = function (callback) 
{
	model.getAnaly(callback);
};


// module.exports.getRecipeFromHtml = getRecipeFromHtml;

//test
// _manager.httpGet("http://www.douguo.com/cookbook/1129090.html", function (err, res)
// {
// 	if (err) {
// 		console.log(err);
// 	}

// 	console.time("indexOf");
// 	getRecipeFromHtml(res.html, res.url, []);
// 	console.timeEnd("indexOf");
// 	// console.time("cheerio");
// 	// getFromCheerio(res.html, res.url, []);
// 	// console.timeEnd("cheerio");
// 	// getFronJsdom(res.html, res.url, []);
// });

// function getFromCheerio (html) {
// 	var $ = cheerio.load(html);
// };


// function getFronJsdom (html) {
// 	console.time("jsdom");
// 	jsdom.env(html, ["http://code.jquery.com/jquery.js"], function (err, window) {
// 		var $ = window.$;
// 		// console.log($("h1").text());
// 	console.timeEnd("jsdom");
// 	});
// };

