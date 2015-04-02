"use strict";

var controller = require('./controller');

var router = require('express').Router();

	router.get('/save', controller.saveData);

module.exports = router;