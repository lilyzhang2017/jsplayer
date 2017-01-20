;!(function(mocoplayer) {
	var utils = mocoplayer.utils = function() {};
	utils.styleLoader = function(url,callback) {
		callback = callback|| function(){};
	    var oHead = document.getElementsByTagName('head')[0];  
	    if(oHead) {    
	        var oStyle = document.createElement('link');   
	        oStyle.setAttribute('href',url);  
	        oStyle.setAttribute('rel','stylesheet');
	        oStyle.setAttribute('type','text/css'); 
	        var loadFunction = function(){  
                if (this.readyState == 'complete' || this.readyState == 'loaded'){  
                    callback();   
                }  
	        };  
	        oStyle.onreadystatechange = loadFunction;  
	        oStyle.onload = callback;
	        oHead.appendChild(oStyle);  
	    }
	};
	utils.scriptLoader = function(url,callback) {
		callback = callback|| function(){};
	    var oHead = document.getElementsByTagName('head')[0];  
	    if(oHead) {    
	        var oScript = document.createElement('script');
	        oScript.setAttribute('src',url);  
	        oScript.setAttribute('type','text/javascript');  

	        var loadFunction = function(){  
                if (this.readyState == 'complete' || this.readyState == 'loaded'){  
                    callback();   
                }  
	        };  
	        oScript.onreadystatechange = loadFunction;  
	        oScript.onload = callback;    
	        oHead.appendChild(oScript);  
	    }
	};
	utils.getScriptPath = function(sname) {
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
            var src = scripts[i].src;
            if (src && src.indexOf(sname) >= 0) {
                return src.substr(0, src.indexOf(sname))
            }
        }
        return ""
    };
    utils.isSafari = function(){
      var vendor = navigator.vendor,userAgent = navigator.userAgent;
          return vendor && vendor.indexOf('Apple') > -1 && userAgent && !userAgent.match('CriOS');
    };
    utils.isIE =function(){
    	var browser = 0;
    	if(!!window.ActiveXObject || "ActiveXObject" in window){
    		var userAgent = navigator.userAgent;
			if (/MSIE \d+\.\d+/.test(userAgent)) {
		        var tempArray = /MSIE (\d+\.\d+)/.exec(userAgent);
		        browser = tempArray[1];
		    } else if (!!(userAgent.match(/Trident/) && userAgent.match(/rv/))){
		        var tempArray = /rv:(\d+\.\d+)/.exec(userAgent);
		        browser = tempArray[1];
		    }
    	}
    	return browser;
    };

    utils.hlsSupported = function () {
    	window.MediaSource = window.MediaSource || window.WebKitMediaSource;
    	return window.MediaSource && typeof window.MediaSource.isTypeSupported === 'function' && window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
    }

    utils.ieTest =function(){
    	var flag = false;
    	var userAgent = navigator.userAgent;
    	if(utils.isIE()){
    		flag = true ;
    		if(utils.isIE()>=11 && (userAgent.indexOf("Windows NT 6.4") > -1 || userAgent.indexOf("Windows NT 10") > -1)){
    			flag = false;
    		}
    	}
    	return flag;
    }
	utils.html5CanPlay = function(){
	 	var canplay = false;
	 	var userAgent = navigator.userAgent.toLowerCase();

		if(!!(document.createElement('video').canPlayType)){
			canplay = true;
			var userAgent = navigator.userAgent.toLowerCase();
			if((userAgent.match(/chrome\/(\d+)/) && parseInt(RegExp.$1, 10) < 46)|| utils.ieTest()){
				canplay =false;
			}
		}
		return canplay;
	};
	utils.flashCanPlay = function(){
		return swfobject.hasFlashPlayerVersion("11");
	};
	utils.setCookie = function(name,value,time){ 
		var oDate = new Date(); 
		oDate.setDate(oDate.getDate()+time); 
		document.cookie = name+"="+value+";domain=imooc.com;path=/;expires="+oDate; 
	} 
	utils.getCookie = function(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)){
        	return unescape(arr[2]);
        }else{
        	return null;
        }
    };
})(mocoplayer);