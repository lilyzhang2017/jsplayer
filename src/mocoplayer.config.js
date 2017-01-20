;!(function(mocoplayer) {
	var defaultConfig = {
		"version":"2.1.12",
		"playbackRates" : ["1.0","1.25","1.5","1.75","2.0"],
		"line": [{
	    	"name":"线路1",
	   		"cdn":"aliyun",
	   		"disabled":false
        },{
	    	"name":"线路2",
	    	"cdn":"letv",
	    	"disabled":false
    	},{
	    	"name":"线路3",
	    	"cdn":"aliyun1",
	    	"disabled":true
    	},{
	    	"name":"错误上报",
	    	"cdn":"error",
	    	"disabled":true
    	}],
		"levels": [{
			"id":"A",
			"name":"自动",
	    	"disabled":false
        },{
        	"id":"L",
    		"name":"普清",
	    	"disabled":false
        },{
        	"id":"M",
	    	"name":"高清",
	    	"disabled":false
        },{
        	"id":"H",
	    	"name":"超清",
	    	"disabled":false
        }],
        "level":0,
        "cdn":0,
		"model":{
			"flash":mocoplayer.utils.flashCanPlay(),
			"html5":mocoplayer.utils.html5CanPlay()
		}
	}
	var config = mocoplayer.config = {
		"playerSrc": {
			"html5" : mocoplayer.utils.getScriptPath("mocoplayer.js") + "mocoplayer.html5.js?v="+defaultConfig.version,
			"css" : mocoplayer.utils.getScriptPath("mocoplayer.js") + "mocoplayer.css?v="+defaultConfig.version,
			"flash"   : mocoplayer.utils.getScriptPath("mocoplayer.js") + "mocoplayer.flash.js?v="+defaultConfig.version,
			"swf"   : mocoplayer.utils.getScriptPath("mocoplayer.js") + "mocoplayer.swf?v="+defaultConfig.version
		},
		levelToInt:function(index){
			var level = 0;
			for(var i=0; i<defaultConfig.levels.length; i++){

				if(defaultConfig.levels[i].id==index){
					level = i;
				}
			}
			return level;
		},
		levelToString:function(index){
			var level = "A"
			if(defaultConfig.levels[index]){
				level = defaultConfig.levels[index].id;
			}
			return level;
		},
		get:function(){
	        var conf=store.get("mocoplayer_conf")||{level:0};
			return $.extend(defaultConfig, conf);
		},
		set:function(key,value){
	        var conf=store.get("mocoplayer_conf")||{};
	        conf[key]=value;
	        store.set("mocoplayer_conf",conf);
		}
	}
})(mocoplayer);