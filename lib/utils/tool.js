"use strict";

var http = require('http');

module.exports.createUrl = function (url, params, query) {

	if (params) {
		for (var i = 0, len = params.length; i < len; i++) {
			url += "/" + params[i] ;
		}
	}
	if (query) {
		url += "?";
		for (var i in query) {
			url += "&" + i + "=" + query[i];
		}
	}
	return url;
};

module.exports.httpGet = function (url, callback) 
{
	http.get(url, function (res){
		res.setEncoding('utf8');
		var ret = {
			statusCode: res.statusCode,
			html: ""
		};

		res.on('data', function (chunk) {
			ret.html += chunk;
	  	});

		res.on('end', function (){
			return callback(null, ret);
		});
	});
};
