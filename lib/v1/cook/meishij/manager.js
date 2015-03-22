"use strict";

var error_handler = require('../../../utils/error_handler');
var _manager = require('../manager');
var model = require('./model');
var _queue = require('./config')._queue;

function analyUrl (q_analy, recipes) 
{
	var url_analy = _queue.queue_analy.queue.slice(_queue.queue_analy.offset, _queue.queue_analy.offset + _queue.queue_analy.limit);
	_queue.queue_analy.offset += url_analy.length;

	// if (url_analy.length > 0) {
	// 	console.log("start analy:" + url_analy.length);
	// 	console.log(":" + url_analy);
	// }
	for (var i = url_analy.length - 1; i >= 0; i--) 
	{
		// exsit error url like "cookbook/1068296/alldish", skip it
		if (url_analy[i].indexOf("html") != -1) {

			_manager.httpGet(url_analy[i], function (err, html, src_url)
			{
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
	// console.log("url: " + url);
	//http://www.meishij.net/zuofa/suanxiangqiukuichaoniurou_1.html
	var recipe = {
		recipeUrl: url
	};
	var offset_s = 0;
	var offset_e = 0;


	// console.log("p1");
	// console.log(JSON.stringify(html));

	offset_s = html.indexOf("BFD_INFO", offset_e);
	if (offset_s === -1) return;

	// console.log("p2");
	offset_s = html.indexOf("{", offset_s);
	if (offset_s === -1) return;

	// console.log("p3");
	offset_e = html.indexOf("};", offset_s);
	if (offset_e === -1) return;

	recipe_str = html.slice(offset_s, offset_e + 1);
	var recipe_obj = JSON.parse(recipe_str);
	recipe_str = null;
	// console.log("p4");

	//base info
	recipe.name = recipe_obj.title;
	recipe.imgUrl = recipe_obj.pic;
	recipe.collectsNum = recipe_obj.renqi;

	recipe.tag = "";
	for (var i = recipe_obj.category.length - 1; i >= 0; i--) {
		recipe.tag += recipe_obj.category[i][0] + ",";
	};
	for (var i = recipe_obj.tag.length - 1; i >= 0; i--) {
		recipe.tag += recipe_obj.tag[i] + ",";
	};
	recipe.tag += recipe_obj.kouwei + ",";


	// //get lookNum, through id of viewclicknum(can not get lookNum, because the web get it by js)
	// offset_s = html.indexOf("viewclicknum", 0);
	// if (offset_s === -1) return;
	// offset_e = html.indexOf("<", offset_s);
	// if (offset_e === -1) return;
	// console.log(html.slice(offset_s, offset_e+10));
	// recipe.lookNum = parseInt(html.slice(offset_s + 14, offset_e)) || 0;

	//other info
	recipe.techniques = recipe_obj.gongyi;

	// console.log(recipe);
	_queue.recipes.array.push(recipe);
	_queue.recipes.count++;


	// console.log(recipe);
	url = null;
	html = null;
	recipe = null;
	offset_s = null;
	offset_e = null;
	recipe_obj = null;
	return;
};

function saveRecipes () 
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
			date = null;
			arrayToInsert = null;
			return;
		}

		console.log("Save recipes(meishij):" + arrayToInsert.length);
		var gc = _queue.recipes.array.splice(_queue.recipes.offset, arrayToInsert.length);

		gc = null;
		date = null;
		arrayToInsert = null;
		return;
	});
};

function saveSeeds (callback) 
{
	delete _queue.queue_seeds._id;
	_queue.queue_seeds.createAt = new Date();

	model.insertSeeds(_queue.queue_seeds, callback);
};

function saveAnaly (callback) 
{
	delete _queue.queue_analy._id;
	_queue.queue_analy.createAt = new Date();

	model.insertAnaly(_queue.queue_analy, callback);
};

function getSeeds (callback) 
{

	model.getSeeds(callback);
};

function getAnaly (callback) 
{

	model.getAnaly(callback);
};

module.exports.analyUrl = analyUrl;
module.exports.saveSeeds = saveSeeds;
module.exports.saveAnaly = saveAnaly;
module.exports.saveRecipes = saveRecipes;
module.exports.getSeeds = getSeeds;
module.exports.getAnaly = getAnaly;

