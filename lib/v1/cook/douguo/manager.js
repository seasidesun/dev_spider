"use strict";

var error_handler = require('../../../utils/error_handler');
var _manager = require('../manager');
var model = require('./model');

module.exports.saveSeeds = function (q_seeds, callback) 
{
	delete q_seeds._id;
	q_seeds.createAt = new Date();

	model.insertSeeds(q_seeds, callback);
};

module.exports.getSeeds = function (callback) 
{
	model.getSeeds(callback);
};

module.exports.saveAnaly = function (q_analy, callback) 
{
	delete q_analy._id;
	q_analy.createAt = new Date();

	model.insertAnaly(q_analy, callback);
};

module.exports.getAnaly = function (callback) 
{
	model.getAnaly(callback);
};

module.exports.saveRecipes = function (recipes) 
{
	var arrayToInsert = recipes.array.slice(recipes.offset, recipes.offset + recipes.limit);
	var date = new Date();

	for (var i = arrayToInsert.length - 1; i >= 0; i--) {
		delete arrayToInsert[i]._id;
		arrayToInsert[i].createAt = date;
	};

	model.saveRecipes(arrayToInsert, function (err, ret) {
		if (err) {
			error_handler.logError(err);
			return;
		}
		console.log("Save recipes:" + arrayToInsert.length);
		recipes.array.splice(recipes.offset, arrayToInsert.length);
	});
};

module.exports.analyUrl = function (q_analy, recipes) 
{
	var url_analy = q_analy.queue.slice(q_analy.offset, q_analy.offset + q_analy.limit);
	q_analy.offset += url_analy.length;
	// console.log("offset/analy: " + q_analy.offset + "/" + q_analy.queue.length);

	for (var i = url_analy.length - 1; i >= 0; i--) 
	{
		// exsit error url like "cookbook/1068296/alldish", skip it
		if (url_analy[i].indexOf("html") === -1) {
			return;
		}
		
		_manager.httpGet(url_analy[i], function (err, res)
		{
			if (err) {
				q_analy.queue.push(err.src_url);
				error_handler.logError(err);
				return;
			}

			getRecipeFromHtml(res.html, res.url, recipes);

		});
	};
};

function getRecipeFromHtml (html, url, recipes) 
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

				lookNum = parseInt(html.slice(offset_s + 1, offset_e));
			}
		}
	}
	recipe.lookNum = lookNum;

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
				collectsNum = parseInt(html.slice(offset_s + 1, offset_e));
			}
		}
	}
	recipe.collectsNum = collectsNum;

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
			offset_e
		}
	}while(offset_s != -1)
	recipe.tag = tag;

	recipes.array.push(recipe);
	recipes.count++;
};
module.exports.getRecipeFromHtml = getRecipeFromHtml;

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

