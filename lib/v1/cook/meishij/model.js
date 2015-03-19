"use strict";

var async = require('async');
var db = require('../../../db');
var meishij_q_seeds = db.getCollection("meishij_q_seeds");
var meishij_q_analy = db.getCollection("meishij_q_analy");
var meishij_recipes = db.getCollection("meishij_recipes");

module.exports.insertSeeds = function (q_seed, callback)
{
	meishij_q_seeds.insert(q_seed, callback);
};

module.exports.insertAnaly = function (q_analy, callback)
{
	meishij_q_analy.insert(q_analy, callback);
};

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

	meishij_recipes.update({"recipeUrl": recipe.recipeUrl}, upateQuery, {upsert: true}, callback);
};

module.exports.getSeeds = function (callback)
{
	meishij_q_seeds.find().sort({"createAt":-1}).limit(1).toArray(callback);
};

module.exports.getAnaly = function (callback)
{
	meishij_q_analy.find().sort({"createAt":-1}).limit(1).toArray(callback);
};

// module.exports.insertRecipes = function (recipes, callback)
// {
// 	meishij_recipes.insert(recipes, callback);
// };
