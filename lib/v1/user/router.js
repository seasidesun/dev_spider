"use strict";

var express = require('express');
var routers = express.Router();
    
    //user login
    routers.get('/login', function (req, res, next) {
        res.send("login");
    });

module.exports = routers;
