"use strict";

var seeds_url = ["http://www.douguo.com/caipu"];

var _queue = {
	"queue_seeds": {
		"queue": seeds_url,
		"base_key": "http://www.douguo.com",
		"seeds_key": "http://www.douguo.com/caipu",
		"offset": 0,
		"limit": 1
	},
	"queue_analy": {
		"queue": [],
		"analy_key": "http://www.douguo.com/cookbook/",
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
