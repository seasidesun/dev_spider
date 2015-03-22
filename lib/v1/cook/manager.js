"use strict";

var error_handler = require('../../utils/error_handler');
var tool = require('../../utils/tool');
var http = require('http');
var urlTool = require('url');

//get spider_offset of url from q_seeds to spider url with seeds_key, if url hava analy_key, insert to q_analy
function spiderUrl (q_seeds, q_analy)
{
	var seeds_left = q_seeds.queue.length - q_seeds.offset;
	var analy_left = q_analy.queue.length - q_analy.offset;
	if (analy_left > 1000 && seeds_left > 5000) return;
	// console.log("queue length:" + q_seeds.queue.length);
	// console.log("offset:" + q_seeds.offset);
	// console.log("limit:" + q_seeds.limit);
	var url_seeds = q_seeds.queue.slice(q_seeds.offset, q_seeds.offset + q_seeds.limit);
	q_seeds.offset += url_seeds.length;
	// console.log("~~~~start spider~~~~" + url_seeds.length);

	for (var i = 0; i < url_seeds.length; i++)
	{
		getHrefFromUrl(url_seeds[i], q_seeds.seeds_key, function (err, hrefs)
		{
			if (err) {
				q_seeds.queue.push(err.src_url);
				error_handler.logError(err);

				err = null;
			}
			if (hrefs) {
				// console.log("get hrefs success");
				for (var j in hrefs) 
				{
					if (j.indexOf(q_analy.analy_key) != -1) {
						// console.log("get analy: " + j);
						pushArray(j, q_analy.queue);
					} else {
						// console.log("get seeds: " + j);
						pushArray(j, q_seeds.queue);
					}
				}

				hrefs = null;
			};
		});
	};

	url_seeds = null;
	return;
};

function getHrefFromUrl (src_url, seeds_key, callback) 
{
	httpGet(src_url, function (err, html) 
	{
		if (err) {
			return callback(err);
		}

		callback(null, getHrefFromHtml(html, seeds_key));

		seeds_key = null;
		src_url = null;
		html = null;
		return;
	});
};

// var html = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\n<meta http-equiv=\"X-UA-Compatible\" content=\"IE=EmulateIE8; charset=UTF-8\" />\n<title>食材的选购及保存的做法_食材的选购及保存怎么做_食材的选购及保存的做法大全_第6页</title>\n<meta name=\"keywords\" content=\"食材的选购及保存,厨房小窍门\" />\n<meta name=\"description\" content=\"食材的选购及保存的做法,食材的选购及保存怎么做,食材的选购及保存的做法大全,食材的选购及保存菜谱,食材的选购及保存\" />\n<!--[if lt IE 7]><script>try { document.execCommand('BackgroundImageCache', false, true); } catch (e) {}</script><![endif]-->\n<!--[if IE 6]><script type=\"text/javascript\" src=\"http://css.meishij.net/n/js/EvPng.js\"></script><script language=\"javascript\" type=\"text/javascript\">EvPNG.fix(\".pngFix,.pngFix:hover\");</script><![endif]-->\n<link rel=\"stylesheet\" type=\"text/css\" media=\"all\" href=\"http://css.meishij.net/n/css/ss_base.css?v=1517\"/><link rel=\"stylesheet\" type=\"text/css\" media=\"all\" href=\"http://css.meishij.net/n/css/main.css?v=1039\"/><link rel=\"stylesheet\" type=\"text/css\" media=\"all\" href=\"http://css.meishij.net/n/css/list.css?v=1623\"/><script type=\"text/javascript\" src=\"http://css.meishij.net/n/js/jquery-1.7.2.min.js\"></script><script type=\"text/javascript\" src=\"http://css.meishij.net/n/js/main.js?v=1510\"></script><script type=\"text/javascript\" src=\"http://css.meishij.net/n/js/list.js?v=1623\"></script><script type=\"text/javascript\" src=\"http://cbjs.baidu.com/js/m.js\"></script><script>var _hmt = _hmt || [];(function() {var hm = document.createElement(\"script\");hm.src = \"//hm.baidu.com/hm.js?01dd6a7c493607e115255b7e72de5f40\";var s = document.getElementsByTagName(\"script\")[0];s.parentNode.insertBefore(hm, s);})();</script>\n</head>\n<body style=\"\"><!--[if IE 6]>\n<style>\n.ie6_warning{width:100%;height:50px;background:#f7efb1;}\n.ie6_warning_w{width:990px;margin:0px auto;text-align:center;}\n.ie6_warning p{color:#4a3e04;line-height:32px;padding:9px 0px;height:32px;}\n.ie6_warning p span{display:inline;zoom:1;line-height:32px;height:32px;vertical-align:top;padding-right:10px;}\n.ie6_warning p a{display:inline;zoom:1;height:32px;width:50px;vertical-align:top;}\n.ie6_warning p a img{display:inline;*zoom:1;height:32px;width:50px;}\n</style>\n<div class=\"ie6_warning\"><div class=\"ie6_warning_w\">\n<p><span>您使用的浏览器内核为IE6，落后于全球76.2%的用户！推荐您直接升级到</span><a target=\"_blank\" href=\"http://windows.microsoft.com/zh-cn/windows/upgrade-your-browser\"><img src=\"http://static.meishij.net/n/images/download_ie8.gif\"></a></p>\n</div></div>\n<![endif]--><div class=\"adinheader\"><div class=\"adinheader_w\"><script type=\"text/javascript\">BAIDU_CLB_fillSlot(\"206520\");</script></div></div><div class=\"header\">\n\t<div class=\"header_c\">\n\t\t<a href=\"http://www.meishij.net/\" class=\"logo pngFix\"></a>\n\t\t<div class=\"main_search_top_w\">\n\t\t\t<div class=\"suggestionsBox\" id=\"suggestions\" style=\"display: none;\"><ul class=\"suggestionList\" id=\"autoSuggestionsList\"></ul></div>\n\t\t\t<form class=\"search\" action=\"http://so.meishi.cc/\">\n\t\t\t\t<input type=\"text\" class=\"text\" name=\"q\" defaultval=\"请输入菜谱/食材/菜单\" x-webkit-speech=\"\" value=\"请输入菜谱/食材/菜单\" autocomplete=\"off\" onfocus=\"if(this.value=='请输入菜谱/食材/菜单'){this.value='';}$(this).css('color','#333');\" onblur=\"if(this.value==''){this.value='请输入菜谱/食材/菜单';$(this).css('color','#999');}\" href=\"/ajax/ajaxtitle.php\" id=\"inputString\"><input type=\"submit\" class=\"submit\" value=\"搜 索\">\n\t\t\t</form>\n\t\t</div>\n\t\t<div class=\"loginitem_h\"><script src='http://reply.meishij.net/ajax/loginheader_n2.php?_=1426955718'></script></div>\n\t</div>\n</div>\n<div class=\"nav\">\n\t<ul id=\"main_nav\">\n\t\t<li ><a href=\"http://www.meishij.net/\" class=\"link pngFix\"><strong>首页</strong></a></li>\n\t\t<li class=\"hasmore current\">\n\t\t\t<a href=\"http://www.meishij.net/chufang/diy/\" class=\"link pngFix\"><strong>菜谱大全</strong></a>\n\t\t\t<div class=\"dw clearfix\">\n\t\t\t\t<div class=\"dww clearfix dww_cpdq\">\n\t\t\t\t\t<div class=\"dwitem clearfix pngFix\"><dl class=\"clearfix\"><dt><a href=\"http://www.meishij.net/chufang/diy/\">家常菜谱</a></dt>\t\t<dd><a href=\"http://www.meishij.net/chufang/diy/jiangchangcaipu/\">家常菜</a></dd>\t<dd><a href=\"http://www.meishij.net/chufang/diy/langcaipu/\">凉菜</a></dd>\t<dd><a href=\"http://www.meishij.net/chufang/diy/sushi/\">素食</a></dd>\t<dd><a href=\"http://www.meishij.net/chufang/diy/wancan/\">晚餐</a></dd>\t<dd><a href=\"http://www.meishij.net/chufang/diy/sijiacai/\">私家菜</a></dd>\t<dd><a href=\"http://www.meishij.net/chufang/diy/recaipu/\">热菜</a></dd>\t<dd><a href=\"http://www.meishij.net/chufang/diy/haixian/\">海鲜</a></dd>\t<dd><a href=\"http://www.meishij.net/chufang/diy/yunfu/\">孕妇</a></dd>\t<dd><a href=\"http://www.meishij.net/chufang/diy/zaocan/\">早餐</a></dd>\t<dd><a href=\"http://www.meishij.net/chufang/diy/wucan/\">午餐</a></dd>\t<dd><a href=\"http://www.meishij.net/chufang/diy/tianpindianxin/\">甜品点心</a></dd>\t<dd><a href=\"http://www.meishij.net/chufang/diy/tangbaocaipu/\">汤粥</a></dd>\t<dd><a href=\"http://www.meishij.net/chufang/diy/baobaocaipu/\">宝宝食谱-婴儿食谱</a></dd>\t<dd><a href=\"http://www.meishij.net/chufang/diy/gaodianxiaochi/\">糕点主食</a></dd>\t<dd><a href=\"http://www.meishij.net/chufang/diy/weibolucaipu/\">微波炉</a></dd></dl></div><div class=\"dwitem dwitem_half clearfix\"><dl class=\"clearfix\"><dt><a href=\"http://www.meishij.net/china-food/caixi/\">中华菜系</a></dt><dd><a href=\"http://www.meishij.net/china-food/caixi/chuancai/\">川菜</a></dd><dd><a href=\"http://www.meishij.net/china-food/caixi/yuecai/\">粤菜</a></dd><dd><a href=\"http://www.meishij.net/china-food/caixi/dongbeicai/\">东北菜</a></dd><dd><a href=\"http://www.meishij.net/china-food/caixi/xiangcai/\">湘菜</a></dd><dd><a href=\"http://www.meishij.net/china-food/caixi/lucai/\">鲁菜</a></dd><dd><a href=\"http://www.meishij.net/china-food/caixi/zhecai/\">浙菜</a></dd><dd><a href=\"http://www.meishij.net/china-food/caixi/hubeicai/\">湖北菜</a></dd><dd><a href=\"http://www.meishij.net/china-food/caixi/qingzhencai/\">清真菜</a></dd></dl></div><div class=\"dwitem dwitem_half clearfix\"><dl class=\"clearfix\"><dt><a href=\"http://www.meishij.net/china-food/xiaochi/\">各地小吃</a></dt>\t<dd><a href=\"http://www.meishij.net/china-food/xiaochi/sichuan/\">四川小吃</a></dd>\t<dd><a href=\"http://www.meishij.net/china-food/xiaochi/guangdong/\">广东小吃</a></dd>\t<dd><a href=\"http://www.meishij.net/china-food/xiaochi/beijing/\">北京小吃</a></dd>\t<dd><a href=\"http://www.meishij.net/china-food/xiaochi/shanxii/\">陕西小吃</a></dd></dl></div><br/><div class=\"dwitem dwitem_half clearfix\"><dl class=\"clearfix\"><dt><a href=\"http://www.meishij.net/chufang/diy/guowaicaipu1/\">外国菜谱</a></dt><dd><a href=\"http://www.meishij.net/chufang/diy/guowaicaipu1/hanguo/\">韩国料理</a></dd><dd><a href=\"http://www.meishij.net/chufang/diy/guowaicaipu1/japan/\">日本料理</a></dd><dd><a href=\"http://www.meishij.net/chufang/diy/guowaicaipu1/faguo/\">法国菜</a></dd><dd><a href=\"http://www.meishij.net/chufang/diy/guowaicaipu1/yidali/\">意大利餐</a></dd></dl></div><div class=\"dwitem dwitem_half clearfix\"><dl class=\"clearfix\"><dt><a href=\"http://www.meishij.net/hongpei/\">烘焙</a></dt><dd><a href=\"http://www.meishij.net/hongpei/dangaomianbao/\">蛋糕面包</a></dd><dd><a href=\"http://www.meishij.net/hongpei/bingganpeifang/\">饼干配方</a></dd><dd><a href=\"http://www.meishij.net/hongpei/tianpindianxin/\">甜品点心</a></dd></dl></div><br/><div class=\"dwitem dwitem_half clearfix\"><dl class=\"clearfix\"><dt><a href=\"http://www.meishij.net/pengren/\">厨房百科</a></dt><dd><a href=\"http://www.meishij.net/pengren/baipanzhoubian/\">摆盘围边</a></dd><dd><a href=\"http://www.meishij.net/pengren/jiqiao/\">烹饪技巧</a></dd><dd><a href=\"http://www.meishij.net/pengren/chufangmiaozhao/\">生活妙招</a></dd><dd><a href=\"http://www.meishij.net/pengren/chufang/\">美食专题</a></dd></dl></div><div class=\"dwitem dwitem_half clearfix\"><dl class=\"clearfix\"><dt><a href=\"http://www.meishij.net/shicai/\">食材百科</a></dt><dd><a href=\"http://www.meishij.net/shicai/shucai_list\">蔬菜</a></dd><dd><a href=\"http://www.meishij.net/shicai/shuiguo_list\">水果</a></dd><dd><a href=\"http://www.meishij.net/shicai/gulei_list\">谷类</a></dd></dl></div><div class=\"bgitem\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</li>\n\t\t<li class=\"hasmore\"><a href=\"http://www.meishij.net/jiankang/\" class=\"link pngFix\"><strong>饮食健康</strong></a>\n\t\t\t<div class=\"dw clearfix\">\n\t\t\t\t<div class=\"dww clearfix dww_ysjk\">\n\t\t\t\t\t<div class=\"dwitem clearfix pngFix\"><dl class=\"clearfix\"><dt><a href=\"http://www.meishij.net/jiankang/\">饮食健康</a></dt><dd><a href=\"http://www.meishij.net/jiankang/changshi/\">饮食小常识</a></dd><dd><a href=\"http://www.meishij.net/jiankang/meirong/\">美容瘦身</a></dd><dd><a href=\"http://www.meishij.net/jiankang/shipinanquan/\">食品安全</a></dd><dd><a href=\"http://www.meishij.net/jiankang/yangsheng/\">养生妙方</a></dd><dd><a href=\"http://www.meishij.net/jiankang/jinji/\">饮食禁忌</a></dd><dd><a href=\"http://www.meishij.net/jiankang/zhongyi/\">中医保健</a></dd><dd><a href=\"http://www.meishij.net/jiankang/muying/\">母婴健康饮食</a></dd><dd><a href=\"http://www.meishij.net/jiankang/yinshixinwen/\">饮食新闻</a></dd></dl></div><div class=\"dwitem clearfix\"><dl class=\"clearfix\"><dt><a href=\"http://www.meishij.net/yaoshanshiliao/gongnengxing/\">功能性调理</a></dt><dd><a href=\"http://www.meishij.net/yaoshanshiliao/gongnengxing/qingrequhuo/\">清热去火</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/gongnengxing/jianfei/\">减肥</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/gongnengxing/qutan/\">祛痰</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/gongnengxing/wufa/\">乌发</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/gongnengxing/ziyinbushen/\">滋阴补肾</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/gongnengxing/jianpikaiwei/\">健脾开胃</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/gongnengxing/xiaohuabulang/\">消化不良</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/gongnengxing/qingrejiedu/\">清热解毒</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/gongnengxing/buyangzhuangyang/\">补阳壮阳</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/gongnengxing/zengfei/\">增肥</a></dd></dl></div><br/><div class=\"dwitem dwitem_half clearfix\"><dl class=\"clearfix\"><dt><a href=\"http://www.meishij.net/yaoshanshiliao/renqunshanshi/\">人群膳食</a></dt><dd><a href=\"http://www.meishij.net/yaoshanshiliao/renqunshanshi/yunfu/\">孕妇</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/renqunshanshi/laoren/\">老人</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/renqunshanshi/chanfu/\">产妇</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/renqunshanshi/rumu/\">哺乳期</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/renqunshanshi/qingshaonian/\">青少年</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/renqunshanshi/rouer/\">幼儿</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/renqunshanshi/xuelingqi/\">学龄期儿童</a></dd></dl></div><div class=\"dwitem dwitem_half clearfix\"><dl class=\"clearfix\"><dt><a href=\"http://www.meishij.net/yaoshanshiliao/jibingtiaoli/\">疾病调理</a></dt><dd><a href=\"http://www.meishij.net/yaoshanshiliao/jibingtiaoli/tangniaobing/\">糖尿病</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/jibingtiaoli/gaoxueya/\">高血压</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/jibingtiaoli/tongfeng/\">痛风</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/jibingtiaoli/weiyan/\">胃炎</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/jibingtiaoli/zhichuang/\">痔疮</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/jibingtiaoli/gengnianqi/\">更年期</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/jibingtiaoli/jiakangxian/\">甲状腺</a></dd></dl></div><br/><div class=\"dwitem clearfix\"><dl class=\"clearfix\"><dt><a href=\"http://www.meishij.net/yaoshanshiliao/zangfu/\">脏腑调理</a></dt><dd><a href=\"http://www.meishij.net/yaoshanshiliao/zangfu/ganmao/\">感冒</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/zangfu/shentiaoli/\">补肾</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/zangfu/yangweizaoxie/\">阳痿早泄</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/zangfu/buxue/\">补血</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/zangfu/bianmi/\">便秘</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/zangfu/fuxie/\">腹泻</a></dd><dd><a href=\"http://www.meishij.net/yaoshanshiliao/zangfu/houxuehuayu/\">活血化瘀</a></dd></dl></div><div class=\"bgitem\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</li>\n\t\t<li ><a href=\"http://i.meishi.cc/recipe_list/\" class=\"link pngFix\"><strong>美食菜单</strong></a></li>\n\t\t<li style=\"position:relative;z-index:100;\"><a style=\"padding:0 11px;\" href=\"http://i.meishi.cc/jiajuguan/yjs.php\" class=\"link pngFix\"><strong>家居馆</strong></a></li>\n\t\t<li ><a href=\"http://i.meishi.cc/daren.html\" class=\"link\"><strong>美食达人</strong></a></li>\n\t\t<li ><a href=\"http://i.meishi.cc/discussion/\" class=\"link pngFix\"><strong>讨论组</strong></a></li>\n\t\t<li ><a href=\"http://sj.meishi.cc/\" class=\"link pngFix\"><strong>手机版下载</strong></a></li>\n\t</ul>\n</div>\n<div class=\"main_search main_search_slideUp pngFix\" slideUp=\"1\" style=\"_display:none;\" id=\"main_search\">\n\t<div class=\"main_search_w\">\n\t\t<div class=\"searchform_div\">\t\t\t<form action=\"http://so.meishi.cc/\" target=\"_blank\"><input type=\"text\" class=\"text\" name=\"q\" defaultval=\"食材的选购及保存\" x-webkit-speech=\"\" value=\"食材的选购及保存\" autocomplete=\"off\" onfocus=\"if(this.value=='食材的选购及保存'){this.value='';}$(this).css('color','#000');\" onblur=\"if(this.value==''){this.value='食材的选购及保存';$(this).css('color','#999');}\" id=\"inputString\" style=\"color: rgb(153, 153, 153);\"><input type=\"submit\" class=\"submit\" value=\"搜 索\"></form>\n\t\t</div>\n\t\t<span id=\"searchslideup_btn\" class=\"pngFix\" style=\"background-position: 0px -48px;\">自动收缩</span>\t</div>\n</div>\n<div class=\"bottom_back_top_top bottom_back_top_top_slideUp\" id=\"bottom_back_top_top\"><a href=\"#\" title=\"返回食材的选购及保存的顶部\" class=\"backtotop pngFix\">回到顶部</a></div>\n<div class=\"main_w clearfix\"><div class=\"main\">\r\n\t<div class=\"listnav clearfix\" id=\"listnav\">\n\t<ul class=\"listnav_ul\" id=\"listnav_ul\">\n\t\t<li disable=\"1\"><a class=\"link\">我的美食属性（未开放）</a></li><li ><a href=\"http://www.meishij.net/chufang/diy/\" class=\"link\">家常菜谱</a></li><li ><a href=\"/china-food/caixi/\" class=\"link\">中华菜系</a></li><li ><a href=\"/china-food/xiaochi/\" class=\"link\">各地小吃</a></li><li ><a href=\"/chufang/diy/guowaicaipu1/\" class=\"link\">外国菜谱</a></li><li ><a href=\"/hongpei/\" class=\"link\">烘焙</a></li><li class=\"current hover\"><a href=\"/pengren/\" class=\"link\">厨房百科</a></li><li ><a href=\"http://www.meishij.net/shicai/\" class=\"link\">食材百科</a></li>\n\t</ul>\n\t\t\t\t\t\t\t<div class=\"other_c listnav_con clearfix\">\n\t\t<dl class=\"listnav_dl_style1 w990 clearfix\">\n\t\t\t<dt>厨房百科</dt>\n\t\t\t<dd class=\"current\"><h1><a href=\"http://www.meishij.net/pengren/xuangoubaocun/\">食材的选购及保存</a></h1></dd><dd ><a href=\"http://www.meishij.net/pengren/chufangmiaozhao/\">生活妙招</a></dd><dd ><a href=\"http://www.meishij.net/pengren/shicaichuangyi/\">食材创意</a></dd><dd ><a href=\"http://www.meishij.net/pengren/baipanzhoubian/\">摆盘围边</a></dd><dd ><a href=\"http://www.meishij.net/pengren/jiqiao/\">烹饪技巧</a></dd><dd ><a href=\"http://www.meishij.net/pengren/chufang/\">美食专题</a></dd></dl>\n\t</div>\n\t\t</div>\t<div class=\"bbtitles\">健康食材，让你吃得放心<span class=\"paixu\"><a href=\"/list.php?sortby=update&lm=348\" class=\"current\">最新</a> | <a href=\"/list.php?sortby=renqi&lm=348\">最热</a></span></div>\r\n\t<div class=\"liststyle1_w clearfix\">\r\n\t\t<div class=\"fliterstyle1\" id=\"fliterstyle1\">\r\n\t\t\t\t\t\t\t<div class=\"fliterstyle1_main\" >\r\n\t\t\t\t\t<ul class=\"tab\"><li class=\"li1\" po=\"1\"><a href=\"####\">普通筛选</a></li><li class=\"li2 current\" po=\"2\"><a href=\"####\">食材筛选</a><span class=\"littletips_new\"></span></li></ul>\r\n\t\t\t\t\t<div class=\"tabcon\" po=\"1\" style=\"display:none;\">\r\n\t\t\t\t\t<dl class=\"clearfix\">\r\n\t\t\t\t\t\t<dt class=\"pngFix\">选择难度</dt><dd class=\"clearfix\"><a href=\"/list.php?sortby=update&lm=348&md=1\">新手尝试</a><a href=\"/list.php?sortby=update&lm=348&md=2\">初级入门</a><a href=\"/list.php?sortby=update&lm=348&md=3\">初中水平</a><a href=\"/list.php?sortby=update&lm=348&md=4\">中级掌勺</a><a href=\"/list.php?sortby=update&lm=348&md=5\">高级厨师</a><a href=\"/list.php?sortby=update&lm=348&md=6\">厨神级</a></dd>\r\n\t\t\t\t\t</dl>\r\n\t\t\t\t\t\t\t\t\t\t<dl class=\"clearfix\">\r\n\t\t\t\t\t\t<dt class=\"pngFix\">选择工艺</dt><dd class=\"clearfix bb0\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t<a href=\"/list.php?sortby=update&lm=348&gy=192\">炒</a><a href=\"/list.php?sortby=update&lm=348&gy=156\">蒸</a><a href=\"/list.php?sortby=update&lm=348&gy=194\">煮</a><a href=\"/list.php?sortby=update&lm=348&gy=124\">炖</a><a href=\"/list.php?sortby=update&lm=348&gy=141\">拌</a><a href=\"/list.php?sortby=update&lm=348&gy=149\">烧</a><a href=\"/list.php?sortby=update&lm=348&gy=129\">煎</a><a href=\"/list.php?sortby=update&lm=348&gy=153\">炸</a><a href=\"/list.php?sortby=update&lm=348&gy=220\">烘焙</a><a href=\"/list.php?sortby=update&lm=348&gy=251\">微波</a>\t\t\t\t\t\t<div class=\"others\"><a href=\"/list.php?sortby=update&lm=348&gy=130\">烤</a><a href=\"/list.php?sortby=update&lm=348&gy=147\">煲</a><a href=\"/list.php?sortby=update&lm=348&gy=144\">焖</a><a href=\"/list.php?sortby=update&lm=348&gy=136\">冻</a><a href=\"/list.php?sortby=update&lm=348&gy=252\">烙</a><a href=\"/list.php?sortby=update&lm=348&gy=148\">砂锅</a><a href=\"/list.php?sortby=update&lm=348&gy=134\">腌</a><a href=\"/list.php?sortby=update&lm=348&gy=138\">卤</a><a href=\"/list.php?sortby=update&lm=348&gy=132\">酱</a><a href=\"/list.php?sortby=update&lm=348&gy=127\">烩</a><a href=\"/list.php?sortby=update&lm=348&gy=112\">扒</a><a href=\"/list.php?sortby=update&lm=348&gy=114\">爆</a><a href=\"/list.php?sortby=update&lm=348&gy=140\">炝</a><a href=\"/list.php?sortby=update&lm=348&gy=142\">熘</a><a href=\"/list.php?sortby=update&lm=348&gy=139\">熏</a><a href=\"/list.php?sortby=update&lm=348&gy=123\">汆</a><a href=\"/list.php?sortby=update&lm=348&gy=113\">拔丝</a><a href=\"/list.php?sortby=update&lm=348&gy=253\">榨汁</a><a href=\"/list.php?sortby=update&lm=348&gy=193\">灼</a><a href=\"/list.php?sortby=update&lm=348&gy=256\">泡</a><a href=\"/list.php?sortby=update&lm=348&gy=133\">腊</a><a href=\"/list.php?sortby=update&lm=348&gy=119\">糖蘸</a><a href=\"/list.php?sortby=update&lm=348&gy=255\">干锅</a><a href=\"/list.php?sortby=update&lm=348&gy=262\">焗</a><a href=\"/list.php?sortby=update&lm=348&gy=260\">干煸</a><a href=\"/list.php?sortby=update&lm=348&gy=261\">煨</a><a href=\"/list.php?sortby=update&lm=348&gy=259\">其他</a></div>\r\n\t\t\t\t\t\t</dd>\r\n\t\t\t\t\t\t<dd class=\"long clearfix filter_otherbtn\">展开全部 >></dd>\r\n\t\t\t\t\t</dl>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<dl class=\"clearfix\">\r\n\t\t\t\t\t\t<dt class=\"pngFix\">选择口味</dt><dd class=\"clearfix\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t<a href=\"/list.php?sortby=update&lm=348&kw=168\">家常味</a><a href=\"/list.php?sortby=update&lm=348&kw=187\">香辣味</a><a href=\"/list.php?sortby=update&lm=348&kw=160\">咸鲜味</a><a href=\"/list.php?sortby=update&lm=348&kw=185\">甜味</a><a href=\"/list.php?sortby=update&lm=348&kw=182\">酸甜味</a><a href=\"/list.php?sortby=update&lm=348&kw=180\">酸辣味</a><a href=\"/list.php?sortby=update&lm=348&kw=177\">麻辣味</a><a href=\"/list.php?sortby=update&lm=348&kw=170\">酱香味</a><a href=\"/list.php?sortby=update&lm=348&kw=257\">奶香味</a><a href=\"/list.php?sortby=update&lm=348&kw=183\">蒜香味</a>\t\t\t\t\t\t<div class=\"others\"><a href=\"/list.php?sortby=update&lm=348&kw=188\">鱼香味</a><a href=\"/list.php?sortby=update&lm=348&kw=162\">葱香味</a><a href=\"/list.php?sortby=update&lm=348&kw=166\">果味</a><a href=\"/list.php?sortby=update&lm=348&kw=186\">五香味</a><a href=\"/list.php?sortby=update&lm=348&kw=173\">咖喱味</a><a href=\"/list.php?sortby=update&lm=348&kw=171\">椒麻味</a><a href=\"/list.php?sortby=update&lm=348&kw=179\">茄汁味</a><a href=\"/list.php?sortby=update&lm=348&kw=266\">酸味</a><a href=\"/list.php?sortby=update&lm=348&kw=174\">苦香味</a><a href=\"/list.php?sortby=update&lm=348&kw=169\">姜汁味</a><a href=\"/list.php?sortby=update&lm=348&kw=165\">怪味</a><a href=\"/list.php?sortby=update&lm=348&kw=172\">芥末味</a><a href=\"/list.php?sortby=update&lm=348&kw=167\">红油味</a><a href=\"/list.php?sortby=update&lm=348&kw=164\">豆瓣味</a><a href=\"/list.php?sortby=update&lm=348&kw=176\">麻酱味</a><a href=\"/list.php?sortby=update&lm=348&kw=264\">黑椒味</a><a href=\"/list.php?sortby=update&lm=348&kw=265\">糊辣味</a><a href=\"/list.php?sortby=update&lm=348&kw=189\">其他</a></div>\r\n\t\t\t\t\t\t</dd>\r\n\t\t\t\t\t\t<dd class=\"long clearfix filter_otherbtn\">展开全部 >></dd>\r\n\t\t\t\t\t</dl>\r\n\t\t\t\t\t\t\t\t\t\t<dl class=\"clearfix\">\t\r\n\t\t\t\t\t\t<dt class=\"pngFix\">选择时间</dt><dd class=\"clearfix\"><a href=\"/list.php?sortby=update&lm=348&mt=1\"><5分钟</a><a href=\"/list.php?sortby=update&lm=348&mt=2\"><10分钟</a><a href=\"/list.php?sortby=update&lm=348&mt=3\"><15分钟</a><a href=\"/list.php?sortby=update&lm=348&mt=4\"><30分钟</a><a href=\"/list.php?sortby=update&lm=348&mt=5\"><60分钟</a><a href=\"/list.php?sortby=update&lm=348&mt=6\"><90分钟</a><a href=\"/list.php?sortby=update&lm=348&mt=7\"><2小时</a><a href=\"/list.php?sortby=update&lm=348&mt=8\"><数小时</a><a href=\"/list.php?sortby=update&lm=348&mt=9\"><一天</a><a href=\"/list.php?sortby=update&lm=348&mt=10\"><数天</a></dd>\r\n\t\t\t\t\t</dl>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"tabcon\" po=\"2\">\r\n\t\t\t\t<div class=\"tabcon_scsearch\">\r\n\t\t\t\t\t<div class=\"w\">\r\n\t\t\t\t\t\t<input type=\"text\" class=\"text\" name=\"q\" id=\"yl_q\" defaultval=\"请输入您想查找的食材\" value=\"请输入您想查找的食材\" autocomplete=\"off\" onfocus=\"if(this.value=='请输入您想查找的食材'){this.value='';}$(this).css('color','#333');\" onblur=\"if(this.value==''){this.value='请输入您想查找的食材';$(this).css('color','#999');}\">\r\n\t\t\t\t\t\t<input type=\"button\" onclick=\"list_add_shicai()\" class=\"submit pngFix\" value=\" \">\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div style=\"padding-top:20px;width:232px;overflow:hidden;\"><script type=\"text/javascript\">BAIDU_CLB_fillSlot(\"502312\");</script></div>\r\n\t</div>\r\n\t<div class=\"listtyle1_w\" id=\"listtyle1_w\">\r\n\t\t<div class=\"listtyle1_list clearfix\" id=\"listtyle1_list\">\r\n\t\t<div class=\"listtyle1\">\r\n\t\t\t<a target=\"_blank\" href=\"http://www.meishij.net/pengren/xuangoubaocun/192122.html\" title=\"怎样挑选新鲜的肉馅？\" class=\"big\">\r\n\t\t\t\t<img class=\"img\" alt=\"怎样挑选新鲜的肉馅？\" src=\"http://images.meishij.net/p/20101219/2a61b0badfc7c7d7d3422180de365246_150x150.jpg\">\r\n\t\t\t\t<div class=\"i_w\">\r\n\t\t\t\t\t<div class=\"ii\" style=\"margin-top: 0px;\">\r\n\t\t\t\t\t\t<div class=\"c1\"><strong>怎样挑选新鲜的肉馅？</strong><span>家里做菜要用到肉馅时，最好是自己动手加工，但很多人为了图方便</span></div>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t</div><div class=\"listtyle1\">\r\n\t\t\t<a target=\"_blank\" href=\"http://www.meishij.net/pengren/xuangoubaocun/192059.html\" title=\"怎样挑选酸甜可口的脐橙？\" class=\"big\">\r\n\t\t\t\t<img class=\"img\" alt=\"怎样挑选酸甜可口的脐橙？\" src=\"http://images.meishij.net/p/20101216/0724aa89877d9edd660f5507418f7b81_150x150.jpg\">\r\n\t\t\t\t<div class=\"i_w\">\r\n\t\t\t\t\t<div class=\"ii\" style=\"margin-top: 0px;\">\r\n\t\t\t\t\t\t<div class=\"c1\"><strong>怎样挑选酸甜可口的脐橙？</strong><span>岁末年初正是脐橙成熟、大量上市的时节，不少人都为选购不到酸甜</span></div>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t</div><div class=\"listtyle1\">\r\n\t\t\t<a target=\"_blank\" href=\"http://www.meishij.net/pengren/xuangoubaocun/191812.html\" title=\"怎样挑到质量好的腐竹？\" class=\"big\">\r\n\t\t\t\t<img class=\"img\" alt=\"怎样挑到质量好的腐竹？\" src=\"http://images.meishij.net/p/20101214/ee2c0c5b0f73b6745ea752cb71648122_150x150.jpg\">\r\n\t\t\t\t<div class=\"i_w\">\r\n\t\t\t\t\t<div class=\"ii\" style=\"margin-top: 0px;\">\r\n\t\t\t\t\t\t<div class=\"c1\"><strong>怎样挑到质量好的腐竹？</strong><span>腐竹口感独特，搭配肉类香味浓郁，佐以蔬菜清香爽口。腐竹蛋白质</span></div>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t</div><div class=\"listtyle1\">\r\n\t\t\t<a target=\"_blank\" href=\"http://www.meishij.net/pengren/xuangoubaocun/191811.html\" title=\"手擀面的保存方法\" class=\"big\">\r\n\t\t\t\t<img class=\"img\" alt=\"手擀面的保存方法\" src=\"http://images.meishij.net/p/20101214/9fb766d72c22b38c19f230b0951f4ed3_150x150.jpg\">\r\n\t\t\t\t<div class=\"i_w\">\r\n\t\t\t\t\t<div class=\"ii\" style=\"margin-top: 0px;\">\r\n\t\t\t\t\t\t<div class=\"c1\"><strong>手擀面的保存方法</strong><span>手擀面的保存方法：暂时吃不完的面条，或者一次多擀一些面条，抖</span></div>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t</div><div class=\"listtyle1\">\r\n\t\t\t<a target=\"_blank\" href=\"http://www.meishij.net/pengren/xuangoubaocun/191697.html\" title=\"肉类最多可以冻多久？\" class=\"big\">\r\n\t\t\t\t<img class=\"img\" alt=\"肉类最多可以冻多久？\" src=\"http://images.meishij.net/p/20101213/5e2bf874ce8208082938f9306de01092_150x150.jpg\">\r\n\t\t\t\t<div class=\"i_w\">\r\n\t\t\t\t\t<div class=\"ii\" style=\"margin-top: 0px;\">\r\n\t\t\t\t\t\t<div class=\"c1\"><strong>肉类最多可以冻多久？</strong><span>肉要冷冻是人人都知道的常识，但说到怎么冻，能冻多久，知道的人</span></div>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t</div><div class=\"listtyle1\">\r\n\t\t\t<a target=\"_blank\" href=\"http://www.meishij.net/pengren/xuangoubaocun/191694.html\" title=\"教你挑选最好吃的黄瓜\" class=\"big\">\r\n\t\t\t\t<img class=\"img\" alt=\"教你挑选最好吃的黄瓜\" src=\"http://images.meishij.net/p/20101213/467e1923614edbabbf46dfd8bb391f52_150x150.jpg\">\r\n\t\t\t\t<div class=\"i_w\">\r\n\t\t\t\t\t<div class=\"ii\" style=\"margin-top: 0px;\">\r\n\t\t\t\t\t\t<div class=\"c1\"><strong>教你挑选最好吃的黄瓜</strong><span>黄瓜清脆爽口，一年四季都深受人们喜爱。但要挑选到好吃营养的黄</span></div>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t</div><div class=\"listtyle1\">\r\n\t\t\t<a target=\"_blank\" href=\"http://www.meishij.net/pengren/xuangoubaocun/191460.html\" title=\"这些调味品开封后能放多久？\" class=\"big\">\r\n\t\t\t\t<img class=\"img\" alt=\"这些调味品开封后能放多久？\" src=\"http://images.meishij.net/p/20101209/46194c918974f1cb4f3a94de08e4285d_150x150.jpg\">\r\n\t\t\t\t<div class=\"i_w\">\r\n\t\t\t\t\t<div class=\"ii\" style=\"margin-top: 0px;\">\r\n\t\t\t\t\t\t<div class=\"c1\"><strong>这些调味品开封后能放多久？</strong><span>经过加工的调味品只要没开封，在包装袋上的保质期前就是安全的。</span></div>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t</div><div class=\"listtyle1\">\r\n\t\t\t<a target=\"_blank\" href=\"http://www.meishij.net/pengren/xuangoubaocun/191458.html\" title=\"怎样取茶叶更好？\" class=\"big\">\r\n\t\t\t\t<img class=\"img\" alt=\"怎样取茶叶更好？\" src=\"http://images.meishij.net/p/20101209/db127bbc6f17781ad6f507dd8e277636_150x150.jpg\">\r\n\t\t\t\t<div class=\"i_w\">\r\n\t\t\t\t\t<div class=\"ii\" style=\"margin-top: 0px;\">\r\n\t\t\t\t\t\t<div class=\"c1\"><strong>怎样取茶叶更好？</strong><span>　　居家待客，沏上一杯香茶，既提神又雅致。但将手伸入茶中取茶</span></div>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t</div><div class=\"listtyle1\">\r\n\t\t\t<a target=\"_blank\" href=\"http://www.meishij.net/pengren/xuangoubaocun/191307.html\" title=\"冬天买菜的3个小建议\" class=\"big\">\r\n\t\t\t\t<img class=\"img\" alt=\"冬天买菜的3个小建议\" src=\"http://images.meishij.net/p/20101208/170a3c619bb90fadbd06281c1081b778_150x150.jpg\">\r\n\t\t\t\t<div class=\"i_w\">\r\n\t\t\t\t\t<div class=\"ii\" style=\"margin-top: 0px;\">\r\n\t\t\t\t\t\t<div class=\"c1\"><strong>冬天买菜的3个小建议</strong><span>冬天绿叶蔬菜相对减少，那么冬天吃什么蔬菜好呢？下面小编就为你</span></div>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t</div><div class=\"listtyle1\">\r\n\t\t\t<a target=\"_blank\" href=\"http://www.meishij.net/pengren/xuangoubaocun/191192.html\" title=\"挑选蜂蜜的5个小提示\" class=\"big\">\r\n\t\t\t\t<img class=\"img\" alt=\"挑选蜂蜜的5个小提示\" src=\"http://images.meishij.net/p/20101208/54c7c8e632b63a29f011ce5503882ab4_150x150.jpg\">\r\n\t\t\t\t<div class=\"i_w\">\r\n\t\t\t\t\t<div class=\"ii\" style=\"margin-top: 0px;\">\r\n\t\t\t\t\t\t<div class=\"c1\"><strong>挑选蜂蜜的5个小提示</strong><span>蜜蜂是世界上唯一会自己生产食物的动物。蜜蜂有“三宝”，蜂蜜、</span></div>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t</div><div class=\"listtyle1\">\r\n\t\t\t<a target=\"_blank\" href=\"http://www.meishij.net/pengren/xuangoubaocun/191187.html\" title=\"怎样选到好山药？\" class=\"big\">\r\n\t\t\t\t<img class=\"img\" alt=\"怎样选到好山药？\" src=\"http://images.meishij.net/p/20101207/c6f869c44382af0fe31b9766fb2f27f4_150x150.jpg\">\r\n\t\t\t\t<div class=\"i_w\">\r\n\t\t\t\t\t<div class=\"ii\" style=\"margin-top: 0px;\">\r\n\t\t\t\t\t\t<div class=\"c1\"><strong>怎样选到好山药？</strong><span>冬季又是食补时，许多人都将山药请上了餐桌。山药质细腻，肉洁白</span></div>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t</div><div class=\"listtyle1\">\r\n\t\t\t<a target=\"_blank\" href=\"http://www.meishij.net/pengren/xuangoubaocun/191065.html\" title=\"胡萝卜的挑选\" class=\"big\">\r\n\t\t\t\t<img class=\"img\" alt=\"胡萝卜的挑选\" src=\"http://images.meishij.net/p/20101206/028e589d1f2f6c86669d692a196f4aad_150x150.jpg\">\r\n\t\t\t\t<div class=\"i_w\">\r\n\t\t\t\t\t<div class=\"ii\" style=\"margin-top: 0px;\">\r\n\t\t\t\t\t\t<div class=\"c1\"><strong>胡萝卜的挑选</strong><span>胡萝卜是一种营养丰富、老幼皆宜的好菜蔬。胡萝卜中营养最丰富的</span></div>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t</div><div class=\"listtyle1\">\r\n\t\t\t<a target=\"_blank\" href=\"http://www.meishij.net/pengren/xuangoubaocun/191061.html\" title=\"鱼虾冷冻保鲜的3个方法\" class=\"big\">\r\n\t\t\t\t<img class=\"img\" alt=\"鱼虾冷冻保鲜的3个方法\" src=\"http://images.meishij.net/p/20101206/d97525ab580c5d4947199a819a277eb2_150x150.jpg\">\r\n\t\t\t\t<div class=\"i_w\">\r\n\t\t\t\t\t<div class=\"ii\" style=\"margin-top: 0px;\">\r\n\t\t\t\t\t\t<div class=\"c1\"><strong>鱼虾冷冻保鲜的3个方法</strong><span>众所周知，海鲜是否安全营养与其新鲜程度息息相关。建议储存海鲜</span></div>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t</div><div class=\"listtyle1\">\r\n\t\t\t<a target=\"_blank\" href=\"http://www.meishij.net/pengren/xuangoubaocun/191060.html\" title=\"红薯的挑选和保存\" class=\"big\">\r\n\t\t\t\t<img class=\"img\" alt=\"红薯的挑选和保存\" src=\"http://images.meishij.net/p/20101206/82ad2a881dc9913a497d4378b847d26f_150x150.jpg\">\r\n\t\t\t\t<div class=\"i_w\">\r\n\t\t\t\t\t<div class=\"ii\" style=\"margin-top: 0px;\">\r\n\t\t\t\t\t\t<div class=\"c1\"><strong>红薯的挑选和保存</strong><span>红薯又称地瓜，有“补虚乏，益气力，健脾胃，强肾阴”的功效，很</span></div>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t</div><div class=\"listtyle1\">\r\n\t\t\t<a target=\"_blank\" href=\"http://www.meishij.net/pengren/xuangoubaocun/190963.html\" title=\"巧选上好洋葱\" class=\"big\">\r\n\t\t\t\t<img class=\"img\" alt=\"巧选上好洋葱\" src=\"http://images.meishij.net/p/20101206/219d8a942cdbce5c57f8c33bd013bca9_150x150.jpg\">\r\n\t\t\t\t<div class=\"i_w\">\r\n\t\t\t\t\t<div class=\"ii\" style=\"margin-top: 0px;\">\r\n\t\t\t\t\t\t<div class=\"c1\"><strong>巧选上好洋葱</strong><span>选购洋葱，其表皮越干越好，包卷度愈紧密愈好；从外表看，最好可</span></div>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t</div><div class=\"listtyle1\">\r\n\t\t\t<a target=\"_blank\" href=\"http://www.meishij.net/pengren/xuangoubaocun/190900.html\" title=\"黑、白胡椒粉的区别\" class=\"big\">\r\n\t\t\t\t<img class=\"img\" alt=\"黑、白胡椒粉的区别\" src=\"http://images.meishij.net/p/20101205/b3201b2f2c1bc5bed6f9a657f32d757f_150x150.jpg\">\r\n\t\t\t\t<div class=\"i_w\">\r\n\t\t\t\t\t<div class=\"ii\" style=\"margin-top: 0px;\">\r\n\t\t\t\t\t\t<div class=\"c1\"><strong>黑、白胡椒粉的区别</strong><span>胡椒粉是胡椒晒干制成的，其中黑胡椒粉是用的未成熟果实，白胡椒</span></div>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t</div><div class=\"listtyle1\">\r\n\t\t\t<a target=\"_blank\" href=\"http://www.meishij.net/pengren/xuangoubaocun/190899.html\" title=\"如何正确挑选芝麻酱？\" class=\"big\">\r\n\t\t\t\t<img class=\"img\" alt=\"如何正确挑选芝麻酱？\" src=\"http://images.meishij.net/p/20101205/0cba0cc92d9c44c43b5233ea9d689e4d_150x150.jpg\">\r\n\t\t\t\t<div class=\"i_w\">\r\n\t\t\t\t\t<div class=\"ii\" style=\"margin-top: 0px;\">\r\n\t\t\t\t\t\t<div class=\"c1\"><strong>如何正确挑选芝麻酱？</strong><span>芝麻酱是将芝麻烘烤、磨制，再加入香油调制而成，是凉菜、涮羊肉</span></div>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t</div><div class=\"listtyle1\">\r\n\t\t\t<a target=\"_blank\" href=\"http://www.meishij.net/pengren/xuangoubaocun/190897.html\" title=\"香蕉识别法：眼看手捏\" class=\"big\">\r\n\t\t\t\t<img class=\"img\" alt=\"香蕉识别法：眼看手捏\" src=\"http://images.meishij.net/p/20101204/d1cb12453ffb4c09b06c62809d61ee99_150x150.jpg\">\r\n\t\t\t\t<div class=\"i_w\">\r\n\t\t\t\t\t<div class=\"ii\" style=\"margin-top: 0px;\">\r\n\t\t\t\t\t\t<div class=\"c1\"><strong>香蕉识别法：眼看手捏</strong><span>有些人购买香蕉时，往往爱拣色泽鲜黄、表皮无斑的果实。其实这样</span></div>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t</div>\t</div><!-- listtyle1_list end -->\r\n\t<div class=\"listtyle1_page\"><div class=\"listtyle1_page_w\"><a href=\"http://www.meishij.net/pengren/xuangoubaocun/?&page=5\" class=\"prev\">上一页</a><a href=\"http://www.meishij.net/pengren/xuangoubaocun/?&page=1\">1</a><span>...</span><a href=\"http://www.meishij.net/pengren/xuangoubaocun/?&page=4\" class=\"\">4</a><a href=\"http://www.meishij.net/pengren/xuangoubaocun/?&page=5\" class=\"\">5</a><a href=\"http://www.meishij.net/pengren/xuangoubaocun/?&page=6\" class=\"current\">6</a><a href=\"http://www.meishij.net/pengren/xuangoubaocun/?&page=7\" class=\"\">7</a><a href=\"http://www.meishij.net/pengren/xuangoubaocun/?&page=8\" class=\"\">8</a><span>...</span><a href=\"http://www.meishij.net/pengren/xuangoubaocun/?&page=7\" class=\"next\">下一页</a><span class=\"gopage\"><form action=\"http://www.meishij.net/list.php\"><input type=\"hidden\" value=\"348\" name=\"lm\" />共21页，到第 <input type=\"text\" class=\"text\" value=\"7\" name=\"page\"> 页 <input type=\"submit\" class=\"submit\" value=\"确定\"></form></span></div></div>\t</div>\r\n</div>\r\n</div>\r\n<script type=\"text/javascript\">\r\nvar is_list_adding = 0;\r\nfunction list_add_shicai(){\r\n\tvar q = $('#yl_q').val();\r\n\tif(q != '' && q != '请输入您想查找的食材'){\r\n\t\tif(is_list_adding == 0){\r\n\t\t\tis_list_adding = 1;\r\n\t\t\t$.get('/ajax/list_add_yl.php?c=' + encodeURIComponent(q), null,\r\n\t\t\tfunction(data) {\r\n\t\t\t\tis_list_adding = 0;\r\n\t\t\t\tdata = parseInt(data);\r\n\t\t\t\tif(data > 0){\r\n\t\t\t\t\tlocation.href = '/list.php?sortby=update&lm=348&yl=' + data;\r\n\t\t\t\t}else{\r\n\t\t\t\t\talert('未能识别的食材，请尝试其他关键字');\r\n\t\t\t\t\t$('#yl_q').val('');\r\n\t\t\t\t}\r\n\t\t\t});\r\n\t\t}\r\n\t}else{\r\n\t\talert('请输入您想查找的食材');\r\n\t}\r\n}\r\n$(function(){\r\n\tvar js = document.createElement(\"script\");\r\n\tjs.language = \"javascript\";\r\n\tjs.src = \"http://click.meishij.net/pl/lclick.php?i=348&addclick=1&_\" +(new Date()).getTime();\r\n\tdocument.body.appendChild(js);\r\n\t\t$(\"#yl_q\").keypress(function(event) {\r\n\t\tif (event.keyCode == 13) {\r\n\t\t\tlist_add_shicai()\r\n\t\t}\r\n\t});\r\n});\r\n</script></div><div style=\"margin:0 auto;padding-top:20px;width:990px;\"><script type=\"text/javascript\">BAIDU_CLB_fillSlot(\"759776\");</script></div><div class=\"main_footer pngFix\">\n\t<div class=\"footer_con1 clearfix\">\n\t\t<p class=\"text pngFix\"><a href=\"http://www.meishij.net/\" class=\"footer_homelink\"></a>\n一个已被用户访问超过<strong>13,000,000,000</strong>次，<br/>帮助了超过<strong>10,000,000</strong>人学会烹饪的美食网站<br/>\n每天，有超过<strong>900,000</strong>人通过美食杰网站和移动APP解决他们的烹饪问题<br/>\n现在，这些数字还在不断的增长着，欢迎您来一起使用美食杰</p>\n\t\t<div class=\"links\">\n\t\t\t<ul class=\"cleearfix\">\n\t\t\t\t<li class=\"sina\"><a class=\"img\" target=\"_blank\" href=\"http://e.weibo.com/meishij\"><span>关注：81万</span></a><p><a target=\"_blank\" href=\"http://e.weibo.com/meishij\">点击进入<br/>美食杰官方微博</a></p></li><li class=\"tengxun\"><a class=\"img\"  target=\"_blank\" href=\"http://user.qzone.qq.com/613171717\"><span>关注：10.3万</span></a><p><a target=\"_blank\" href=\"http://user.qzone.qq.com/613171717\">点击进入<br/>美食杰QQ空间</a></p></li><li class=\"weixin\"><a target=\"_blank\" href=\"http://sj.meishi.cc/\" class=\"img\"></a><p><a target=\"_blank\" href=\"http://sj.meishi.cc/\">扫描二维码添加<br/>美食杰为微信好友</a></p></li><li class=\"download\"><a target=\"_blank\" href=\"http://sj.meishi.cc/\" class=\"img\"></a><p><a target=\"_blank\" href=\"http://sj.meishi.cc/\">扫描二维码下载<br/>美食杰手机客户端</a></p></li>\n\t\t\t</ul>\n\t\t</div>\n\t</div>\n\t\t<div class=\"footer_con3\">\n\t\t<ul class=\"clearfix\">\n\t\t\t<li><a target=\"_blank\" href=\"http://www.meishij.net/siteinfo/index.php\" title=\"公司简介\">公司简介</a></li>\n\t\t\t<li><a target=\"_blank\" href=\"http://www.meishij.net/siteinfo/index.php#qywh\" title=\"企业文化\">企业文化</a></li>\n\t\t\t<li><a target=\"_blank\" href=\"http://www.meishij.net/siteinfo/index.php#gsdt\" title=\"公司动态\">公司动态</a></li>\n\t\t\t<li><a target=\"_blank\" href=\"http://www.meishij.net/siteinfo/index.php#mzsm\" title=\"免责声明\">免责声明</a></li>\n\t\t\t<li><a target=\"_blank\" href=\"http://www.meishij.net/siteinfo/contact.php\" title=\"联系我们\">联系我们</a></li>\n\t\t\t<li><a target=\"_blank\" href=\"http://www.meishij.net/siteinfo/hr.php\" title=\"招贤纳士\">招贤纳士</a></li>\n\t\t\t<li><a target=\"_blank\" href=\"http://www.meishij.net/siteinfo/bd.php\" title=\"商务合作\">商务合作</a></li>\n\t\t\t<li><a target=\"_blank\" href=\"http://www.meishij.net/siteinfo/maps.php\" title=\"网站地图\">网站地图</a></li>\n\t\t\t<li><a target=\"_blank\" href=\"http://www.meishij.net/siteinfo/links.php\" title=\"友情链接\">友情链接</a></li>\n\t\t\t<li><a target=\"_blank\" href=\"http://sj.meishi.cc/\" title=\"美食杰移动APP\">美食杰移动APP</a></li>\n\t\t</ul>\n\t\t<p>ICP证号：<a target=\"_blank\" href=\"http://www.miibeian.gov.cn\" class=\"gray_a\">京ICP备14030359号</a>/京公网安备11010802009977 Copyright © 2003-2015 MEISHIJ CO.,LTD.</p>\n\t\t<p>公司全称：北京美时杰信息技术有限公司  公司地址：北京市海淀区海淀大街38号银科大厦  公司电话：010-82603929</p>\n\t</div>\n</div><div style=\"display:none;\"><script language=\"javascript\" type=\"text/javascript\" src=\"http://js.users.51.la/2139665.js\"></script>\n<noscript><a href=\"http://www.51.la/?2139665\" target=\"_blank\"><img alt=\"&#x6211;&#x8981;&#x5566;&#x514D;&#x8D39;&#x7EDF;&#x8BA1;\" src=\"http://img.users.51.la/2139665.asp\" style=\"border:none\" /></a></noscript></div></body></html>\n";

// getHrefFromHtml(html, "http://www.meishij.net");
function getHrefFromHtml (html, seeds_key)
{
	var hrefs_obj = {};
	var href = "";
	var offset_s = 0;
	var offset_e = 0;
	do {
		if (offset_e < 0) break;
		offset_s = html.indexOf(seeds_key, offset_e);

		if (offset_s != -1) {


			var offset_e = Math.min(html.indexOf('"', offset_s), html.indexOf("'", offset_s), html.indexOf(" ", offset_s));
			// offset_e = html.indexOf('"', offset_s);
			// if (offset_e === -1) offset_e = html.indexOf("'", offset_s);
			// if (offset_e === -1) offset_e = html.indexOf(" ", offset_s) - 1;

			if (offset_e != -1){
				href = html.slice(offset_s, offset_e);
				href = clearUrl(href);
				hrefs_obj[href] = true;
			}
		} else {
			break;
		}
	}while(offset_s != -1);

	html = null;
	href = null;
	offset_s = null;
	offset_e = null;
	seeds_key = null;
	return hrefs_obj;
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
	// url = encodeURI(url);
	var url_obj = urlTool.parse(encodeURI(url));
	// console.log(url_obj.path);

	var option = {
		// host: "49.94.130.19",
		// port: 80,
		hostname: url_obj.hostname,
		path: url_obj.path,
		header: {
			"Host": url_obj.hostname,
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
		},
		secureProtocol: 'SSLv3_method'
	};

	var html = "";
	var req = http.request(option, function (res){
	// var req = http.get("http://www.meishij.net/chufang/diy/", function (res){
		res.setEncoding('utf8');

		res.on('data', function (chunk) {
			html += chunk;
			chunk = null;
	  	});

	  	res.on('end', function(){

			if (res.statusCode === 200) {
				// console.log(res.statusCode);
				callback(null, html, url);
			} else {
				// console.log(res.statusCode);
				var err = error_handler.generateError(res.statusCode, "10001", "httpGet Error:" + url, false)();
				err.src_url = url;
				// ret = null;
				callback(err);

				err = null;
				// return;
			}

			url = null;
			html = null;
			return;
	  	});
	});

	req.end();
	req = null;
	url_obj = null;
	option = null;
};

function clearQueue (queue_obj) 
{
	var hash = {};
	for (var i = queue_obj.offset, len = queue_obj.queue.length; i < len; i++) 
	{
		queue_obj.queue[i] = clearUrl(queue_obj.queue[i]);
		hash[queue_obj.queue[i]] = true;
	};

	var gc = queue_obj.queue.splice(queue_obj.offset);
	for (var i in hash)
	{	
		queue_obj.queue.push(i);
	};

	gc = null;
	hash = null;
	return;
};

function clearUrl (url) 
{
	if (!url) return;
	var offset = url.indexOf("'", 0);
	if (offset != -1) {
		url = url.slice(0, offset);
	}
	offset = null;

	var tag = url.slice(-1);

	if (tag === "/") {
		url = url.slice(0, -1);
		tag = null;
		return url;
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

	item = null;
	return;
};


// var obj = {
// 	"queue": []
// };

// var queue = ["haha"];
// // // var obj = [];

// function test (queue, callback) {
// 	// var obj = {
// 	// 	"queue" : []
// 	// };
// 	obj.queue.push(queue);
// 	callback(obj);

// 	console.log("!!!!!!");
// 	obj = null;
// 	return;
// };

// test(queue, function (obj){
// 	setTimeout(function () {
// 		console.log(obj);
// 	}, 2000);
// });
// console.log(queue);


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
module.exports.clearQueue = clearQueue;
module.exports.httpGet = httpGet;
module.exports.pushArray = pushArray;
module.exports.spiderUrl = spiderUrl;
module.exports.getHrefFromUrl = getHrefFromUrl;
module.exports.getHrefFromHtml = getHrefFromHtml;