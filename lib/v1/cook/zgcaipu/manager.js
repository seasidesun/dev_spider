"use strict";

var error_handler = require('../../../utils/error_handler');
var _manager = require('../manager');
var model = require('./model');
var _queue = require('./config')._queue;
var base_url = "http://www.chinacaipu.com";

module.exports.analyUrl = function () 
{
	// var url_analy = q_analy.queue.slice(q_analy.offset, q_analy.offset + q_analy.limit);
	var url_analy = _queue.queue_analy.queue.slice(_queue.queue_analy.offset, _queue.queue_analy.offset + _queue.queue_analy.limit);
	_queue.queue_analy.offset += url_analy.length;
	// console.log("analyUrl:"+url_analy.length);

	for (var i = url_analy.length - 1; i >= 0; i--) 
	{
		// exsit error url like "cookbook/1068296/alldish", skip it
		if (url_analy[i].indexOf("html") != -1) 
		{
			_manager.httpGet(url_analy[i], function (err, html, src_url)
			{
				// if (html) html = null;
				if (err) {
					// _queue.queue_analy.queue.push(err.src_url);
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
	// console.log(html);
	var recipe = {
		recipeUrl: url
	};
	var offset_s = 0;
	var offset_e = 0;


	//get name through class of "contit" 
	// console.log("get name");
	var name = null;
	offset_s = html.indexOf("contit", offset_e);
	if (offset_s != -1) {

		offset_s = html.indexOf(">", offset_s);
		if (offset_s != -1) {

			offset_e = html.indexOf("<", offset_s);
			if (offset_e != -1) {

				name = html.slice(offset_s + 1, offset_e);
			}
		}
	}
	recipe.name = name;
	name = null;

	++offset_e;
	//get imgUrl through 'rel="id="content""'
	// console.log("get imgUrl");
	var imgUrl = null;
	offset_s = html.indexOf('id="content"', offset_e);
	if (offset_s != -1) {

		offset_s = html.indexOf('src="', offset_s);
		if (offset_s != -1) {

			offset_s += 5;
			offset_e = html.indexOf('"', offset_s);
			if (offset_e != -1) {

				imgUrl = html.slice(offset_s, offset_e);
			}
		}
	}
	recipe.imgUrl = imgUrl;
	imgUrl = null;

	//get tag through class "crumbs"
	var tag = [];

	offset_s = html.indexOf("crumbs", 0);
	offset_e = offset_s;
	if (offset_s != -1) {

		var end_positon = html.indexOf("</div>", offset_s);
		if (end_positon != -1) {
			var stag = "";
			do {
				offset_s = html.indexOf("href", offset_s);
				if (offset_s != -1) {
					
					offset_s = html.indexOf(">", offset_s);
					if (offset_s != -1) {

						offset_e = html.indexOf("<", offset_s);
						if (offset_e != -1 && offset_e < end_positon){

							stag = html.slice(offset_s + 1, offset_e);
							tag.push(stag);
						} else {
							break;
						}
					};
				}

			}while(offset_e < end_positon)
			stag = null;
		};
	};
	var gc = tag.splice(0,2);
	gc = tag.splice(-1, 1);
	recipe.tag = tag.join(",");
	tag = null;

	// console.log(recipe);

	_queue.recipes.array.push(recipe);
	_queue.recipes.count++;

	offset_s = null;
	offset_e = null;
	recipe = null;
	html = null;
	url = null;
	gc = null;
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

		console.log("Save recipes(zgcaipu):" + arrayToInsert.length);
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

