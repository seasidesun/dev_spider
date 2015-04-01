"use strict";

var async = require('async');
var db = require('../../../db');
var zgcaipu_q_seeds = db.getCollection("zgcaipu_q_seeds");
var zgcaipu_q_analy = db.getCollection("zgcaipu_q_analy");
var zgcaipu_recipes = db.getCollection("zgcaipu_recipes");

module.exports.insertSeeds = function (q_seed, callback)
{
	zgcaipu_q_seeds.insert(q_seed, callback);
};

module.exports.getSeeds = function (callback)
{
	zgcaipu_q_seeds.find().sort({"createAt":-1}).limit(1).toArray(callback);
};

module.exports.insertAnaly = function (q_analy, callback)
{
	zgcaipu_q_analy.insert(q_analy, callback);
};

module.exports.getAnaly = function (callback)
{
	zgcaipu_q_analy.find().sort({"createAt":-1}).limit(1).toArray(callback);
};

// module.exports.insertRecipes = function (recipes, callback)
// {
// 	zgcaipu_recipes.insert(recipes, callback);
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

	zgcaipu_recipes.update({"recipeUrl": recipe.recipeUrl}, upateQuery, {upsert: true}, callback);
};
