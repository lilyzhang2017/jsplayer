(function(mocoplayer) {
	var flashplayer = mocoplayer.flash = function() {};
	var option = {};
	var player = "";
	var controll = "";
	var readyFlag = 0;
	// 全局处理播放器调用js回调
	flashplayer.callback= function (playerId, event, data) {
	    switch (event) {
	        case "onJavaScriptBridgeCreated":
	            // reference to player
	            //player = document.getElementById(playerId);
	            //listen('canPlayChange,durationChange,timeChange');
	            //window.PLAYER = player;
	            //player.initPlayer(option);

	            break;
   			case "initPlayer":
   				console.log("initPlayer")
   				console.log(JSON.stringify(option))
   				player.setVolume(option.volume);
           		player.initPlayer(JSON.stringify(option));
           		break;
	            // player state change
	        case "ready":
	        	console.log("ready")
// player.displayAd({
//                 id: "showVideoMidrollAd"
//                 , url: "http://images4.c-ctrip.com/target/fd/tuangou/g2/M0A/71/F9/CghzgVWWs1OAYiOmAAD8z7_BKHA184_720_480_s.jpg"
//                 , hideScrubBarWhilePlayingAd: true
//                 , pauseMainMediaWhilePlayingAd: true
//                 , resumePlaybackAfterAd: true
//                 , preBufferAd: true
//                 , clickUrl: "http://osmfhls.kutu.ru"
//                 , closable: true
//                 ,autoCloseAfter:2
//                 ,onClose:"onAdComplete"
//             });
				if(!readyFlag){
					readyFlag = 1;
					option.events.onReady.call(controll);
				}
	        	
	        	break;
	        case "loading":
	        	break;
	        case "playing":
	        	//events.handle('playing');
	        	break;
	        case "paused":
	        case "buffering":

	            // other events
	        case "mediaSize":
	        	
	        	break;
	        case "seeking":
	        	//console.log('seeking');
	        	break;
	        case "seeked":
	        	//console.log('seeked');
	        	break;
	        case "volumeChange":
	        	//console.log('volume');
	        	controll.volumeChange(data.volume);
	        	break;
	        case "durationChange":
	        	//console.log('duration');
	        	break;
	        case "timeChange":
	        	break;
	        case "progress": // for progressive download only
	        	break;
	        case "setConfig":
	        	console.log("setConfig");
	        	data= JSON.parse(data);
	        	data.level = mocoplayer.config.levelToInt(data.level);

	        	mocoplayer.config.set("cdn",data.cdn);
	        	mocoplayer.config.set("level",data.level);
	        	mocoplayer.config.set("primary",data.primary);

	        	if( data.primary == "html5"){
	        		readyFlag = 0;
	        		controll.switchPlayer("html5",data)
	        	}

	        	break;
	        case "beforeComplete":
	        	option.events.onbeforeComplete.call(controll);
	        	break;
	        case "complete":
	        	console.log("complete")
	        	//readyFlag = 0;
	        	player.pause();
	        	option.events.onComplete.call(controll);
	        	break;
	        case "advertisement":
	        	break;
	        case "playerError":
	        console.log("playerError");
	        	data= JSON.parse(data);
	        	option.events.onError(data.error);
	        	break;
	        default:
	            // console.log(event, data);
	            break;
	    }
	}

	flashplayer.init =function(container,opt){
		controll = this;
		option = opt;
		option.level = mocoplayer.config.levelToString(option.level); //level转字母
		var vname = $(container).get(0).id+"-flash-video";
		var swfpath = mocoplayer.config.playerSrc["swf"];
		$(container).html("<div id='"+vname+"'/>");
	    var attrs = {
			name: vname,
			data: swfpath,
			width:"100%",
			height:"100%"
	    }

	    var params = {
	    	autoPlay:false,
	    	autoRewind:false,
		    allowFullScreen: true,
		    allowScriptAccess: "always",
		    bgcolor: "#000000",
		    wmode: "Opaque",
	  		flashvars: 'javascriptCallbackFunction=mocoplayer.flash.callback&controlBarAutoHide=false'
	    };

	    swfobject.createSWF(attrs, params, vname);

		player = document.getElementById(vname);

		return player;
	}
})(mocoplayer);