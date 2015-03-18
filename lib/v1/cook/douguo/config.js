"use strict";

var seeds_url = ["http://www.douguo.com"];

var _queue = {
	"queue_seeds": {
		"queue": seeds_url,
		"seeds_key": "http://www",
		"offset": 0,
		"limit": 1
	},
	"queue_analy": {
		"queue": [],
		"analy_key": "http://www.douguo.com/cookbook/",
		"offset": 0,
		"limit": 1
	},
	"recipes": {
		"array": [],
		"offset": 0,
		"limit": 100,
		"count": 0
	}
};

module.exports._queue = _queue;
