var	mocoplayer = function(container, opt){
	var logurl = "http://moco.imooc.com/player/api/visitlog.html";
	var option = {
		url: "",
		image: '',
		volume: 1,
		rate: 1,
		title: '',
		currentTime: 0,
		events: {
			//初始化完成事件
			onReady: function(){
			},
			//播放完成前事件
			onbeforeComplete: function(){
			},
			//播放完成事件
			onComplete:function(){
			},
		},
		plugin:{
			// subtitle:{
			// 	content:''
			// },
			// copyright:{
			// 	image:'',
			// 	time:''
			// }
		}
	}
	option = $.extend(option, opt);

	var visitlog = function(code){
		var level = mocoplayer.config.get().level;
		/*$.ajax({
			url:logurl,
			data:{
				code:code,
				level:level
			},
			cache:false,
			dataType:"jsonp"
		});*/
	}
	var cberror = function(){};
	if(opt.events&&opt.events.onError){
		cberror = opt.events.onError;
	}
	option.events.onError = function(err){
		visitlog(err);
		var msg = mocoplayer.error(container,err);
		cberror(msg);
	}

	//加载播放器上报
	visitlog("00000000");
	return new mocoplayer.init(container,option);
}