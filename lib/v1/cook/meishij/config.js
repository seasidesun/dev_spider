"use strict";

var seeds_url = ["http://www.meishij.net/chufang/diy"];

var _queue = {
	"queue_seeds": {
		"queue": seeds_url,
		"seeds_key": "http://www.meishij.net",
		"offset": 0,
		"limit": 2
	},
	"queue_analy": {
		"queue": [],
		"analy_key": "http://www.meishij.net/zuofa",
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
