"use strict";

var seeds_url = ["http://www.chinacaipu.com/menu"];

var _queue = {
	"queue_seeds": {
		"queue": seeds_url,
		"base_key": "/menu/",
		"seeds_key": "/menu/",
		"uri": "http://www.chinacaipu.com",
		"offset": 0,
		"limit": 1
	},
	"queue_analy": {
		"queue": [],
		"analy_key": "html",
		"offset": 0,
		"limit": 2
	},
	"recipes": {
		"array": [],
		"offset": 0,
		"limit": 100,
		"count": 0
	}
};

module.exports._queue = _queue;
