"use strict";

var async = require('async');
var db = require('../../../db');
var douguo_q_seeds = db.getCollection("douguo_q_seeds");
var douguo_q_analy = db.getCollection("douguo_q_analy");
var douguo_recipes = db.getCollection("douguo_recipes");

module.exports.insertSeeds = function (q_seed, callback)
{
	douguo_q_seeds.insert(q_seed, callback);
};

module.exports.getSeeds = function (callback)
{
	douguo_q_seeds.find().sort({"createAt":-1}).limit(1).toArray(callback);
};

module.exports.insertAnaly = function (q_analy, callback)
{
	douguo_q_analy.insert(q_analy, callback);
};

module.exports.getAnaly = function (callback)
{
	douguo_q_analy.find().sort({"createAt":-1}).limit(1).toArray(callback);
};

// module.exports.insertRecipes = function (recipes, callback)
// {
// 	douguo_recipes.insert(recipes, callback);
// };

module.exports.saveRecipes = function (recipes, callback)
{
	async.each(recipes, module.exports.updateRecipe, function (err) {
		if (err) {
			return callback(err);
		}
		return callback(null);
	});
};

module.exports.updateRecipe = function (recipe, callback) 
{
	var upateQuery = {};
	upateQuery.$set = recipe;

	douguo_recipes.update({"recipeUrl": recipe.recipeUrl}, upateQuery, {upsert: true}, callback);
};
