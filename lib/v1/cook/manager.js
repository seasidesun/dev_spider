"use strict";

var error_handler = require('../../utils/error_handler');
var tool = require('../../utils/tool');
var http = require('http');
var urlTool = require('url');
// var _proxy = {
// 	proxyList: [],
// 	position: 0,
// 	count: 1
// };

// setInterval(function()
// {
// 	_proxy.count = 0;	
// 	updateProxy();
// }, 12*60*60*1000);


//get spider_offset of url from q_seeds to spider url with seeds_key, if url hava analy_key, insert to q_analy
function spiderUrl (q_seeds, q_analy)
{
	// console.log("~~~~start spider~~~~");
	// console.log("queue length:" + q_seeds.queue.length);
	// console.log("offset:" + q_seeds.offset);
	// console.log("limit:" + q_seeds.limit);
	var url_seeds = q_seeds.queue.slice(q_seeds.offset, q_seeds.offset + q_seeds.limit);
	q_seeds.offset += url_seeds.length;

	for (var i = 0; i < url_seeds.length; i++)
	{
		getHrefFromUrl(url_seeds[i], q_seeds.seeds_key, function (err, hrefs, src_url)
		{
			// console.log(src_url);
			if (err) {
				q_seeds.queue.push(err.src_url);
				error_handler.logError(err);
			}
			// console.log("get hrefs success");
			if (hrefs) {
				// console.log(hrefs);
				for (var j = 0; j < hrefs.length; j++)
				{
					// console.log("in");
					// console.log("href:" + hrefs[j]) ;
					if (hrefs[j].indexOf(q_analy.analy_key) != -1) {
						pushArray(hrefs[j], q_analy.queue);
					} else {
						pushArray(hrefs[j], q_seeds.queue);
					}
				};
				// console.log(q_analy.queue);
			};
		});
	};
};

function getHrefFromUrl (src_url, seeds_key, callback) 
{
	httpGet(src_url, function (err, res) 
	{
		if (err) {
			return callback(err);
		}

		return callback(null, getHrefFromHtml(res.html, seeds_key), src_url);
	});
};

function getHrefFromHtml (html, seeds_key)
{
	var hrefArray = [];
	var href = "";
	var offset_s = 0;
	var offset_e = 0;
	do {
		offset_s = html.indexOf(seeds_key, offset_e);

		if (offset_s != -1) {

			offset_e = html.indexOf('"', offset_s);
			if (offset_e === -1) offset_e = html.indexOf("'", offset_s);
			if (offset_e === -1) offset_e = html.indexOf(" ", offset_s) - 1;

			if (offset_e != -1){
				href = clearUrl(html.slice(offset_s, offset_e));
				hrefArray.push(href);
			}
		} else {
			break;
		}
	}while(offset_s != -1);

	return hrefArray;
};

function httpGet (url, callback) 
{
	// console.log("!!!!!!");
	// console.log(url);
	// url = "http://www.douguo.com/cookbook/1131185.html";
	// url = "http://www.douguo.com/caipu/家常菜";
	// url = "http://www.douguo.com/caipu";
	// url = "http://www.meishij.net/chufang/diy";
	// url = "http://www.meishij.net/chufang/diy/jiangchangcaipu";
	// url = "http://www.meishij.net/zuofa/suanxiangqiukuichaoniurou_1.html";
	if (url.indexOf("html", 0) === -1) url += "/";
	
	var url_obj = urlTool.parse(encodeURI(url));
	// console.log(url);

	var option = {
		// host: "49.94.130.19",
		// port: 80,
		hostname: url_obj.hostname,
		path: url_obj.path,
		header: {
			// "Host": url_obj.hostname,
			"Connection": "keep-alive",
			"Cache-Control": "max-age=0",
			"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
			"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36",
			"Referer": "https://www.baidu.com/s?wd=%E8%B1%86%E6%9E%9C%E7%BD%91&rsv_spt=1&issp=1&f=8&rsv_bp=0&rsv_idx=2&ie=utf-8&tn=baiduhome_pg&rsv_enter=1&inputT=2235&rsv_pq=8fa5cbb50000448d&rsv_t=a6c4mhUDftaAg9%2Bekc6PpqYwVJSQDSrbvTkOjdHsi6j8ljueH1BSp2wm4aN9fcXPagJK&oq=parll&rsv_sug1=124&rsv_sug3=184&bs=http%20header",
			"Accept-Encoding": "gzip,deflate,sdch",
			"Accept-Language": "zh-CN,zh;q=0.8,en;q=0.6",
			"Cookie": "bdshare_firstime=1426057243999; PHPSESSID=ds9o22lhtimk6g106iq7k5dn60; last_show=1426660080815; _gat=1; dg_auths=a%3A5%3A%7Bs%3A10%3A%22session_id%22%3Bs%3A32%3A%226252d4d7c300ab434fc2a6ceac95ea3e%22%3Bs%3A10%3A%22ip_address%22%3Bs%3A13%3A%22124.207.235.2%22%3Bs%3A10%3A%22user_agent%22%3Bs%3A50%3A%22Mozilla%2F5.0+%28Macintosh%3B+Intel+Mac+OS+X+10_10_1%29+Ap%22%3Bs%3A13%3A%22last_activity%22%3Bi%3A1426658281%3Bs%3A9%3A%22mycaptcha%22%3Bs%3A4%3A%22pKFI%22%3B%7Ddadc530e0fa941d360d092920a940d85; CNZZDATA30029854=cnzz_eid%3D625361616-1425979273-http%253A%252F%252Fwww.baidu.com%252F%26ntime%3D1426657493; showNums=2; _ga=GA1.2.765269308.1425980773",
			"RA-Ver": "2.8.9",
			"RA-Sid": "7CCAC862-20150120-052156-1b00e2-9e9f35",
		}
	};


	// var option = {
	// 	host: _proxy.proxyList[_proxy.position]? _proxy.proxyList[_proxy.position].host:  "localhost",
	// 	port: _proxy.proxyList[_proxy.position]? _proxy.proxyList[_proxy.position].port: 80
	// };

	// if(option.host != "localhost"){
	// 	_proxy.position++;
	// 	if (_proxy.position >= _proxy.proxyList.length) _proxy.position = 0;
	// } else {
	// 	var err = error_handler.generateError(500, "10002", "httpGet Error: No proxy", false)();
	// 	err.src_url = url;
	// 	return callback(err);
	// }
	// console.log(option);

	var req = http.request(option, function (res){
	// var req = http.get("http://www.meishij.net/chufang/diy/", function (res){
		res.setEncoding('utf8');

		var ret = {
			url: url,
			statusCode: res.statusCode,
			html: ""
		};

		res.on('data', function (chunk) {
			ret.html += chunk;
	  	});

	  	res.on('end', function(){
			if (res.statusCode === 200) {
				// console.log(res.statusCode);
				return callback(null, ret);
			} else {
				// console.log(res.statusCode);
				var err = error_handler.generateError(res.statusCode, "10001", "httpGet Error:" + url, false)();
				err.src_url = url;
				return callback(err);
			}
	  	});
	});

	req.end();
};

function clearUrl (url) 
{
	if (url.slice(-1) === "/") {
		return url.slice(0, -1);
	} else {
		return url;
	}
};

function pushArray (item, array)
{
	for (var i = array.length - 1; i >= 0; i--) 
	{
		if (array[i] === item) return;
	};

	array.push(item);
	return;
};

function updateProxy () 
{
	if (_proxy.count > 4) {
		// console.log(_proxy.proxyList);
		return;
	}

	var option = {
		hostname: "www.kuaidaili.com",
		path: "/proxylist/"+ _proxy.count +"/",
		header: {
			"Date": new Date(),
			"Content-Type": "application/x-www-form-urlencoded",
			"Referer": "http://www.kuaidaili.com/proxyList/3/",
			"User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.3; .NET4.0C; .NET4.0E)"
		}
	};

	var req = http.request(option, function (res){
		res.setEncoding('utf8');

		var ret = {
			statusCode: res.statusCode,
			html: ""
		};

		res.on('data', function (chunk) {
			ret.html += chunk;
	  	});

	  	res.on('end', function(){
	  		if (res.statusCode === 200) {
	  			_proxy.count++;
	  			// console.log("success");
	  			// console.log(ret.html);
	  			analyProxy(ret.html);
	  		} 
	  		setTimeout(updateProxy, 5*1000);
	  	});
	});

	req.end();
};

function analyProxy (html) 
{
	var pot_s = html.indexOf("<tbody>", 0);
	var pot_e = html.indexOf("</tbody>", 0);
	var offset_s = pot_s;
	var offset_e = pot_s;
	// console.log(pot_s);

	do{
		var proxy = {};
		offset_s = html.indexOf("<tr>", offset_e);
		if (offset_s === -1) break;
		offset_s = html.indexOf("<td>", offset_s);
		if (offset_s === -1) break;
		offset_e = html.indexOf("</td>", offset_s);
		if (offset_e === -1) break;
		proxy.host = html.slice(offset_s + 4, offset_e);
		// _proxy.proxyList.push(html.slice(offset_s + 4, offset_e));

		offset_s = html.indexOf("<td>", offset_e);
		if (offset_s === -1) break;
		offset_e = html.indexOf("</td>", offset_s);
		if (offset_e === -1) break;
		proxy.port = parseInt(html.slice(offset_s + 4, offset_e));
		_proxy.proxyList.push(proxy);
		// console.log(_proxy);
		// _proxy.proxyList.push(html.slice(offset_s + 4, offset_e));

	}while(offset_e < pot_e)
};

module.exports.updateProxy = updateProxy;
module.exports.httpGet = httpGet;
module.exports.pushArray = pushArray;
module.exports.spiderUrl = spiderUrl;
module.exports.getHrefFromUrl = getHrefFromUrl;
module.exports.getHrefFromHtml = getHrefFromHtml;