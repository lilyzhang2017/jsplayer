;!(function(mocoplayer) {
	mocoplayer.init = function(container,option){
		//cdn测速后切换cdn
    	if(mocoplayer.utils.getCookie("mocoplayer_cdn")){
    		mocoplayer.config.set("cdn",mocoplayer.utils.getCookie("mocoplayer_cdn"));
    		mocoplayer.utils.setCookie("mocoplayer_cdn","0",-1)
    	}
		//私有播放参数设置
		var config = mocoplayer.config.get();
		$.extend(option, config);

		var _this = this;

		var setup = function(){
			if(option.url=="") {
				option.events.onError("M0x00001");
				return;
			}
			if(!$(container).length) {
				option.events.onError("M0x00002");
				return;
			}
			if(option.model.html5 && (option.primary != "flash" || !option.model.flash)){
				if(mocoplayer.html5){
					html5Init()
				}else{
					mocoplayer.utils.scriptLoader(mocoplayer.config.playerSrc["html5"],function(){
						html5Init();
					})
				}
			}else{
				if(!option.model.flash){
					option.events.onError("M0x00003");
					return false;
				}
		
				if(mocoplayer.flash){
					flashInit();
				}else{
					mocoplayer.utils.scriptLoader(mocoplayer.config.playerSrc["flash"],function(){
						flashInit();
					})
				}
			}		
		}

		var html5Init = function(){
			var HlsPlayer = mocoplayer.html5.init.call(_this,container,option)
			HlsPlayer.ready(function(){
				//_this.play();
			    option.events.onReady.call(_this);
		    })
			HlsPlayer.playbackRate(option.rate)

		    _this.onComplete=function(){
				if(document.exitFullscreen) {
				    document.exitFullscreen();
				} else if(document.mozCancelFullScreen) {
				    document.mozCancelFullScreen();
				} else if(document.webkitExitFullscreen) {
				    document.webkitExitFullscreen();
				}
				option.events.onComplete.call(_this);
		    }

		    _this.onRateChange=function(){
				mocoplayer.config.set("rate",HlsPlayer.playbackRate());
		    }
 
			_this.volumeChange = function(){
				option.volume = HlsPlayer.volume();
				mocoplayer.config.set("volume",option.volume);
			}

			_this.play = function(){
				HlsPlayer.play();
			}
			_this.pause = function(){
				HlsPlayer.pause();
			}
			// _this.seek = function(t){
			// 	HlsPlayer.currentTime(t);
			// 	HlsPlayer.play();
			// }
			_this.getCurrentTime = function(){
				return HlsPlayer.currentTime();
			}

			_this.getPlayRate=function(){
				return HlsPlayer.playbackRate();
			}
			_this.getPlayState = _this.getState = function(){
				return HlsPlayer.paused()?"paused":"playing";
			}
			//销毁
			_this.destroy =function(){
				HlsPlayer.destroy();
				$(container).html("");
			}
		}

		var flashInit = function(){
			var FlashPlayer = mocoplayer.flash.init.call(_this,container,option);

			_this.play = function(){
				FlashPlayer.play2();
			}
			_this.pause = function(){
				FlashPlayer.pause();
			}
			// _this.seek = function(t){
			// 	console.log("seel:"+t)
			// 	FlashPlayer.seek(t);
			// }
			_this.getCurrentTime = function(){
				return FlashPlayer.getCurrentTime();
			}
			_this.getPlayState = _this.getState = function(){
				return FlashPlayer.getState();
			}

			_this.volumeChange = function(volume){
				option.volume = volume;
				mocoplayer.config.set("volume",volume);
			}
			//销毁
			_this.destroy =function(){
				//FlashPlayer.remove();
				$(container).html("");
			}
		}

		window.switchPlayer=function(data){
        	mocoplayer.config.set("cdn",data.cdn);
        	mocoplayer.config.set("level",data.level);
        	mocoplayer.config.set("primary",data.primary);

        	if( data.primary == "flash"){
				_this.switchPlayer("flash",data)
        	}else{
        		window.hdChange(data.level)
        	}
		}

		this.switchPlayer = function(type,data){
			var t = _this.getCurrentTime()
			option.primary = type;
			option.cdn = data.cdn;
			option.rate = mocoplayer.config.get().rate;
			option.currentTime = t;
			option.level = data.level

			_this.pause();
			_this.destroy();
			setup();
		}



		var bind =function(){
			if(option.model.html5){
				//如果浏览器不支持hls
				if(!mocoplayer.utils.hlsSupported()){
					if(option.model.flash){
						option.primary = "flash";
						option.model.html5 = false;
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
				      	return;
					}
				}
				//mac safari 兼容
				if(mocoplayer.utils.isSafari()){
					if(option.currentTime<0.5){
						option.currentTime = 0.5;
					}
				}
			}
			//<track kind="captions" src="captions.vtt" srclang="en" label="English" default>
			var playername = $(container).get(0).id + "-mocoplayer";
			container.html('<div id="'+playername+'"  class="mocoplayer" />');
			container = "#"+playername;
			setup();			
		}
		mocoplayer.utils.styleLoader(mocoplayer.config.playerSrc["css"],function(){
			bind();
		});

	function handleFocus(){
		 console.log('get focus------');
		document.addEventHandler('keydown',allkeyDown);
	}
	function handleBlur(){
		 console.log('lost focus------');
		document.removeEventHandler('keydown',allkeyDown);
	}
	function allkeyDown(event){

    if(HlsPlayer.ended()===true){
      return;
    }
   
    var e = event || window.event;
    var key=e.keyCode;
    var focusedElement = document.activeElement; 
    if(focusedElement.type==='textarea' ||focusedElement.type==='text' ){
      return;
    }
    console.log(key,'====player.js key down');
    switch(key){
     
     
    case 37: // left-arrow, if not adMode
        if(HlsPlayer.currentTime()>5){
          HlsPlayer.currentTime( HlsPlayer.currentTime()-5);
        }
        break;
    case 39: // right-arrow, if not adMode
       if((HlsPlayer.currentTime()+5)<HlsPlayer.duration()){
          HlsPlayer.currentTime( HlsPlayer.currentTime()+5);
        }
        break;
    case 38: // up-arrow
         HlsPlayer.volume(HlsPlayer.volume()+0.1);         
      
          break;
    case 40: // down-arrow
           HlsPlayer.volume(HlsPlayer.volume()-0.1);            
           break;

    }
    event.preventDefault();
    
  }
		}

	}
})(mocoplayer);