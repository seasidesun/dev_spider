"use strict";

var error_handler = require('../../../utils/error_handler');
var _manager = require('../manager');
var model = require('./model');

function analyUrl (q_analy, recipes) 
{
	var url_analy = q_analy.queue.slice(q_analy.offset, q_analy.offset + q_analy.limit);
	q_analy.offset += url_analy.length;

	for (var i = url_analy.length - 1; i >= 0; i--) 
	{
		// exsit error url like "cookbook/1068296/alldish", skip it
		if (url_analy[i].indexOf("html") != -1) {

			_manager.httpGet(url_analy[i], function (err, res)
			{
				if (err) {
					q_analy.queue.push(err.src_url);
					error_handler.logError(err);
				} else {
					getRecipeFromHtml(res.html, res.url, recipes);
				}
			});
		}
	};
};

function getRecipeFromHtml (html, url, recipes) 
{
	//http://www.meishij.net/zuofa/suanxiangqiukuichaoniurou_1.html
	var recipe = {
		recipeUrl: url
	};
	var offset_s = 0;
	var offset_e = 0;


	offset_s = html.indexOf("BFD_INFO", offset_e);
	if (offset_s === -1) return;

	offset_s = html.indexOf("{", offset_s);
	if (offset_s === -1) return;

	offset_e = html.indexOf("};", offset_s);
	if (offset_e === -1) return;

	var recipes_obj = JSON.parse(html.slice(offset_s, offset_e + 1));

	//base info
	recipe.name = recipes_obj.title;
	recipe.imgUrl = recipes_obj.pic;
	recipe.collectsNum = recipes_obj.renqi;

	recipe.tag = "";
	for (var i = recipes_obj.category.length - 1; i >= 0; i--) {
		recipe.tag += recipes_obj.category[i][0] + ",";
	};
	for (var i = recipes_obj.tag.length - 1; i >= 0; i--) {
		recipe.tag += recipes_obj.tag[i] + ",";
	};
	recipe.tag += recipes_obj.kouwei + ",";


	// //get lookNum, through id of viewclicknum(can not get lookNum, because the web get it by js)
	// offset_s = html.indexOf("viewclicknum", 0);
	// if (offset_s === -1) return;
	// offset_e = html.indexOf("<", offset_s);
	// if (offset_e === -1) return;
	// console.log(html.slice(offset_s, offset_e+10));
	// recipe.lookNum = parseInt(html.slice(offset_s + 14, offset_e)) || 0;

	//other info
	recipe.techniques = recipes_obj.gongyi;

	recipes.array.push(recipe);
	recipes.count++;
	// console.log(recipe);
	return;
};

function saveSeeds (q_seeds, callback) 
{
	delete q_seeds._id;
	q_seeds.createAt = new Date();

	model.insertSeeds(q_seeds, callback);
};

function saveAnaly (q_analy, callback) 
{
	delete q_analy._id;
	q_analy.createAt = new Date();

	model.insertAnaly(q_analy, callback);
};

function saveRecipes (recipes) 
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
		console.log("Save recipes(meishij):" + arrayToInsert.length);
		recipes.array.splice(recipes.offset, arrayToInsert.length);
	});
};

function getSeeds (callback) 
{

	model.getSeeds(callback);
};

function getAnaly (callback) 
{

	model.getAnaly(callback);
};

module.exports.getRecipeFromHtml = getRecipeFromHtml;
module.exports.analyUrl = analyUrl;
module.exports.saveSeeds = saveSeeds;
module.exports.getSeeds = getSeeds;
module.exports.saveAnaly = saveAnaly;
module.exports.getAnaly = getAnaly;
module.exports.saveRecipes = saveRecipes;

