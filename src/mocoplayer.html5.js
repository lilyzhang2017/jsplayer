(function(mocoplayer) {
	var h5video = mocoplayer.html5 = function() {};
 	var hls,events, stats, videobox,controll,
      enableWorker = true,

      levelDefault = -1,
      myPlayer = "",
      defaultAudioCodec = undefined,
      option = {}, 
      cdnChanged = 0;
      cdnTimeout = 0;

	  var getURLParam = function(sParam, defaultValue) {
	    var sPageURL = window.location.search.substring(1);
	    var sURLVariables = sPageURL.split('&');
	    for (var i = 0; i < sURLVariables.length; i++) {
	      var sParameterName = sURLVariables[i].split('=');
	      if (sParameterName[0] == sParam) {
	        return "undefined" == sParameterName[1] ? undefined : sParameterName[1];
	      }
	    }
	    return defaultValue;
	  }

	  var loadStream = function(url,video) {
	  	console.log(url);
	  	url :"m3u8h5.json?cid=56&mid=1054";
		 if(Hls.isSupported()) {
		       if(hls) {
		         hls.destroy();
		         if(hls.bufferTimer) {
		            clearInterval(hls.bufferTimer);
		           hls.bufferTimer = undefined;
		         }
		         hls = null;
		       }

		       events = { url : url, t0 : performance.now(), load : [], buffer : [], video : [], level : [], bitrate : []};

		       hls = new Hls({debug:true, enableWorker : enableWorker, defaultAudioCodec : defaultAudioCodec});


		       hls.loadSource(url);

		       if(levelDefault == -1){
		       		hls.autoLevelCapping = levelDefault;
		       }else{
		       		hls.loadLevel = levelDefault;
		       }
		       
		      // hls.autoLevelCapping = levelDefault;
		       hls.attachMedia(video);

		       
		       hls.on(Hls.Events.FRAG_BUFFERED,function(event,data) {
		       	console.log("FRAG_BUFFERED");
		       	reSeekStream();
		          
		       });
		       

		       hls.on(Hls.Events.ERROR, function(event,data) {
		       	var error = "";
		        switch(data.details) {
		          case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
		          	error = "H0x10001";

		            break;
		          case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
		            //$("#HlsStatus").text("timeout while loading manifest");
		            break;
		          case Hls.ErrorDetails.MANIFEST_PARSING_ERROR:
		          	error = "H0x10002";
		            //$("#HlsStatus").text("error while parsing manifest:" + data.reason);
		            break;
		          case Hls.ErrorDetails.LEVEL_LOAD_ERROR:
		            //$("#HlsStatus").text("error while loading level playlist");
		            break;
		          case Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT:
		           // $("#HlsStatus").text("timeout while loading level playlist");
		            break;
		          case Hls.ErrorDetails.LEVEL_SWITCH_ERROR:
		            //$("#HlsStatus").text("error while trying to switch to level " + data.level);
		            break;
		          case Hls.ErrorDetails.FRAG_LOAD_ERROR:
		          console.log("FRAG_LOAD_ERROR:"+data.fatal)
		          console.log("cdnTimeout:"+cdnTimeout)
		          	if(cdnTimeout == 1) {
		          		return;
		          	}
					if(data.fatal && !cdnChanged){
						console.log("crossDomainSet")
						cdnChanged = 1;
						crossDomainSet();
					}else{
						if(!data.fatal){
							cdnChanged = 0;
						}
					}

		            //$("#HlsStatus").text("error while loading fragment " + data.frag.url);
		            break;
		          case Hls.ErrorDetails.FRAG_LOAD_TIMEOUT:
		          console.log("FRAG_LOAD_TIMEOUT:"+data.fatal)
					if(data.fatal && !cdnChanged){
						console.log("reloadStream")
						cdnChanged = 1
						cdnTimeout = 0;
						reloadStream();
					}else{
						if(!data.fatal){
							cdnTimeout = 1;
							cdnChanged = 0;
						}else{
							cdnChanged = 0;
						}
					}
		           // $("#HlsStatus").text("timeout while loading fragment " + data.frag.url);
		            break;
		          case Hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
		          console.log("Frag Loop Loading Error")
		            //$("#HlsStatus").text("Frag Loop Loading Error");
		            break;
		          case Hls.ErrorDetails.FRAG_DECRYPT_ERROR:
		           console.log("FRAG_DECRYPT_ERROR")
		            //$("#HlsStatus").text("Decrypting Error:" + data.reason);
		            break;
		          case Hls.ErrorDetails.FRAG_PARSING_ERROR:
		          console.log("FRAG_PARSING_ERROR")
		            //$("#HlsStatus").text("Parsing Error:" + data.reason);
		            break;
		          case Hls.ErrorDetails.KEY_LOAD_ERROR:
		            //$("#HlsStatus").text("error while loading key " + data.frag.decryptdata.uri);
		            break;
		          case Hls.ErrorDetails.KEY_LOAD_TIMEOUT:
		            //$("#HlsStatus").text("timeout while loading key " + data.frag.decryptdata.uri);
		            break;
		          case Hls.ErrorDetails.BUFFER_APPEND_ERROR:
		            //$("#HlsStatus").text("Buffer Append Error");
		            break;
		          case Hls.ErrorDetails.BUFFER_ADD_CODEC_ERROR:
		            //$("#HlsStatus").text("Buffer Add Codec Error for " + data.mimeType + ":" + data.err.message);
		            break;
		          case Hls.ErrorDetails.BUFFER_APPENDING_ERROR:
		            //$("#HlsStatus").text("Buffer Appending Error");
		            break;
		          default:
		            break;
		        }

		      if(error!=""){
	       	  	option.events.onError(error);
	       	  }
		       //  if(data.fatal) {
		       //    switch(data.type) {
		       //      case Hls.ErrorTypes.MEDIA_ERROR:
		       //        handleMediaError();
		       //        break;
		       //      case Hls.ErrorTypes.NETWORK_ERROR:
		       //        $("#HlsStatus").append(",network error ...");
		       //        break;
		       //      default:
		       //        $("#HlsStatus").append(", unrecoverable error");
		       //        hls.destroy();
		       //        break;
		       //    }
		       //    console.log($("#HlsStatus").text());
		       //  }
		       //  if(!stats) stats = {};
		       //  // track all errors independently
		       //  if (stats[data.details] === undefined) {
		       //    stats[data.details] = 1;
		       //  } else {
		       //    stats[data.details] += 1;
		       //  }
		       //  // track fatal error
		       //  if (data.fatal) {
		       //    if (stats.fatalError === undefined) {
		       //      stats.fatalError = 1;
		       //    } else {
		       //        stats.fatalError += 1;
		       //    }
		       //  }
		       //  $("#HlsStats").text(JSON.stringify(sortObject(stats),null,"\t"));
		       });

		       // hls.on(Hls.Events.BUFFER_CREATED, function(event,data) {
		       //  tracks = data.tracks;
		       // });

		       // hls.on(Hls.Events.FPS_DROP,function(event,data) {
		       //    var evt = {time : performance.now() - events.t0, type : "frame drop", name : data.currentDropped + "/" + data.currentDecoded};
		       //    events.video.push(evt);
		       //    if (stats) {
		       //     if (stats.fpsDropEvent === undefined) {
		       //        stats.fpsDropEvent = 1;
		       //      } else {
		       //        stats.fpsDropEvent++;
		       //      }
		       //      stats.fpsTotalDroppedFrames = data.totalDroppedFrames;
		       //    }
		       // });
		       // video.addEventListener('resize', handleVideoEvent);
		       // video.addEventListener('seeking', handleVideoEvent);
		       // video.addEventListener('seeked', handleVideoEvent);
		       // video.addEventListener('pause', handleVideoEvent);
		       // video.addEventListener('play', handleVideoEvent);
		       // video.addEventListener('canplay', handleVideoEvent);
		       // video.addEventListener('canplaythrough', handleVideoEvent);
		       // video.addEventListener('ended', handleVideoEvent);
		       // video.addEventListener('playing', handleVideoEvent);
		       // video.addEventListener('error', handleVideoEvent);
		       // video.addEventListener('loadedmetadata', handleVideoEvent);
		       // video.addEventListener('loadeddata', handleVideoEvent);
		       // video.addEventListener('durationchange', handleVideoEvent);
		    } else {
				if(option.model.flash){
					var data={
						primary:"flash",
						cdn:0,
						level:0,
						html5:false
					}
					switchPlayer(data);

			      	if(navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
			      		option.events.onError("00x10004");
			      	} else {
						option.events.onError("00x10005");
			      	}
				}else{
			      	if(navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
			      		option.events.onError("H0x10004");
			      	} else {
						option.events.onError("H0x10005");
			      	}
				}
		    }
	  }

	var bindVideoEvent = function(video){
		video.addEventListener('resize', handleVideoEvent);
	    video.addEventListener('seeking', handleVideoEvent);
	    video.addEventListener('seeked', handleVideoEvent);
	       video.addEventListener('pause', handleVideoEvent);
	       video.addEventListener('play', handleVideoEvent);
	       video.addEventListener('canplay', handleVideoEvent);
	       video.addEventListener('canplaythrough', handleVideoEvent);
	       video.addEventListener('ended', handleVideoEvent);
	       video.addEventListener('playing', handleVideoEvent);
	       video.addEventListener('ratechange', handleVideoEvent);
	       video.addEventListener('volumechange',handleVideoEvent);
	       video.addEventListener('error', handleVideoEvent);
	       video.addEventListener('loadedmetadata', handleVideoEvent);
	       video.addEventListener('loadeddata', handleVideoEvent);
	       video.addEventListener('durationchange', handleVideoEvent);
	}
	var lastSeekingIdx, lastStartPosition,lastDuration;
	  var handleVideoEvent = function(evt) {
	    var data = '';

	    switch(evt.type) {
	       case 'durationchange':
	       if(evt.target.duration - lastDuration <= 0.5) {
	        // some browsers reports several duration change events with almost the same value ... avoid spamming video events
	        return;
	       }
	        lastDuration = evt.target.duration;
	         data = Math.round(evt.target.duration*1000);
	         break;
	      case 'resize':
	        data = evt.target.videoWidth + '/' + evt.target.videoHeight;
	        break;
	      case 'ended':
	      		console.log("ended")
	      		if(!cdnReset){
	      			console.log("onComplete")
	      			controll.onComplete();
	      		}
	           break;
	      case 'loadedmetadata':
	      //   data = 'duration:' + evt.target.duration + '/videoWidth:' + evt.target.videoWidth + '/videoHeight:' + evt.target.videoHeight;
	      //  break;

	      case 'loadeddata':
	      break;
	      case 'canplay':
			if(option.currentTime){
				videobox.currentTime(option.currentTime);
				option.currentTime = 0;
			}
	      	break;
	      case 'canplaythrough':
	      	break;
	      case 'seeking':

	      		console.log('seeking--------')
	      		//timeStart();
	      		lastStartPosition = evt.target.currentTime;
	      		break;

	      case 'seeked':

	      		console.log('seeked-------')
	      		//timeClose();
	      		//reSeekStream();
	      		break;

	      case 'play':

	      		console.log('play--------')
	     		//timeStart();
	      		break;

	      case 'playing':

	      		console.log('playing--------')
				//timeClose();
	       		lastStartPosition = evt.target.currentTime;
	        	//reSeekStream();
	      		break;

	      case 'pause':
	      		//timeClose();
	      		break;

	      case 'waiting':

	      		break;

	  	  case 'ratechange':
	  	  		controll.onRateChange();
	      	break;
	  	  case 'volumechange':
	  	  		//volumeChange
	  	  	controll.volumeChange();
	      	break;



	      case 'stalled':
	      		break;
	      case 'error':

			    data = Math.round(evt.target.currentTime*1000);
			    if(evt.type === 'error') {
			          var errorTxt,mediaError=evt.currentTarget.error;
			          switch(mediaError.code) {
			            case mediaError.MEDIA_ERR_ABORTED:
			               errorTxt = "H0x00001";
			              break;
			            case mediaError.MEDIA_ERR_DECODE:
			              errorTxt = "H0x00002";

			              break;
			            case mediaError.MEDIA_ERR_NETWORK:
			              errorTxt = "H0x00003";
			              break;
			            case mediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
			              errorTxt = "H0x00004";
			              break;
			        }
			        option.events.onError(errorTxt);
			          //$("#HlsStatus").text(errorTxt);
			    }

    
	        break;
	      // case 'progress':
	      //   data = 'currentTime:' + evt.target.currentTime + ',bufferRange:[' + this.video.buffered.start(0) + ',' + this.video.buffered.end(0) + ']';
	      //   break;
	      default:
	      break;
	    }
	    var event = {time : performance.now() - events.t0, type : evt.type, name : data};
	    events.video.push(event);
	    if(evt.type === 'seeking') {
	      lastSeekingIdx = events.video.length-1;
	    }
	    if(evt.type === 'seeked') {
	      events.video[lastSeekingIdx].duration = event.time - events.video[lastSeekingIdx].time;
	    }
	  }








	var bindEvent = function(){
		$(document).on('contextmenu','video',function() { return false; })
		window.hdChange =function(level){

			level = level-1;
			//if(cdnTimer) return;
			if(level!=-1){
				hls.nextLoadLevel=level;
			}else{
				//hls.autoLevelCapping = level;
			}
		}	
	}





	//cdn switch---------

	var CdnDefault=0,cdnReset =0 ;

	var crossDomainSet = function(){
		if(option.model.flash){
			var data={
				primary:"flash",
				cdn:0,
				level:0
			}
			option.events.onError("00x10001");
			switchPlayer(data);
		}else{
			option.events.onError("H0x00006");
		}
	}

	var reloadStream=function ()
	 {

		CdnDefault++;

		var currCdn = option.line[CdnDefault]
		if(!currCdn||currCdn.cdn=="error"){
			option.events.onError("H0x00007");
			return;
		}else{
			option.events.onError("00x2000"+CdnDefault);
		}
		

	  	var newurl=""
	  	if(option.url.indexOf("?")!=-1){
	  		newurl = option.url + "&cdn="+ currCdn.cdn;
	  	}else{
	  		newurl = option.url + "?cdn="+ currCdn.cdn;
	  	} 
	  	newurl ="m3u8h5.json?cid=56&mid=1054";
		//currTime = videobox.currentTime();
		option.currentTime = videobox.currentTime();
		//videobox.currentTime(0);
		cdnReset = 1;
		//hls.destroy();
		loadStream(decodeURIComponent(getURLParam('src',newurl)),myPlayer);
	  	//hls.loadSource(decodeURIComponent(getURLParam('src',newurl)));

	}

	var reSeekStream = function(){
		if(cdnReset == 1){
			cdnReset=0;
			if(option.currentTime<0.5){
				option.currentTime = 0.5;
			}
			mocoplayer.config.set("cdn",CdnDefault);
			videobox.currentTime(option.currentTime);
			videobox.play();
		}
	}
	// var timeStart = function(){
	//   	clearTimeout(cdnTimer);
	//   	cdnTimer = null;
	//   	//$(".vjs-progress-control").hide();
	//   	cdnTimer = setTimeout(function() {
	//   		console.log('time start');
	// 		reloadStrem();
	//     }, 10000);
	// }
	// var timeClose = function() {
	//   clearTimeout(cdnTimer);
	//   cdnTimer = null;
	//   if(cdnReset == 1){
	//   	cdnReset=0;
	//   	videobox.currentTime(option.currentTime);
	//   	videobox.play();
	//   }
	//   //$(".vjs-progress-control").show();
	// }


	// window.CdnTimerStart = timeStart;
	// window.CdnTimerEnd = timeClose;

	h5video.init =function(container,opt){
		controll = this;
		var vname= $(container).get(0).id+"-hls-video";

		if(!window.hdChange){
			bindEvent();
		}
		
		$(container).html('<video  id="'+vname+'" class="video-js vjs-default-skin videoCentered"\
		 controls  preload="auto" autobuffer> </video>')

		//$('#'+vname).attr("data-setup",'{"playbackRates":'+opt.playbackRates+'}')

		levelDefault = opt.level-1;
		CdnDefault = opt.cdn;

		myPlayer = $('#'+vname)[0];
	  	myPlayer.volume = opt.volume;

	  	var url=""
	  	if(opt.url.indexOf("?")!=-1){
	  		url = opt.url + "&cdn="+opt.line[CdnDefault].cdn;
	  	}else{
	  		url = opt.url + "?cdn="+opt.line[CdnDefault].cdn;
	  	} 
	  	url ="m3u8h5.json?cid=56&mid=1054";
	  	option = opt;

	  	if(hls){
	  		hls.attachMedia(myPlayer);
	  	}else{
	  		loadStream(decodeURIComponent(getURLParam('src',url)),myPlayer);
	  	}
	  	bindVideoEvent(myPlayer)
	   	videobox = videojs(vname,opt);
	   	videobox.destroy = function(){
	   		this.dispose();  //销毁video
	   		hls.detachMedia(); //hls解除绑定
	   		//hls.destroy();
	   	}
	   	return videobox;
	}




})(mocoplayer);