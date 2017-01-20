;!(function(mocoplayer) {
	//错误代码，提示用户并上报
	var errorcode = {
		"M0x00000":'视频播放器错误',
		"M0x00001":'视频地址错误',
		"M0x00002":"can not found container",
		"M0x00003":"未安装Flash或Flash版本过低，为了更好的播放体验，建议安装最新版chrome或firefox浏览器 <a href='http://www.imooc.com/static/html/browser.html'>下载浏览器</a>",
		"H0x00001":"You aborted the video playback",
		"H0x00002":"The video playback was aborted due to a corruption problem or because the video used features your browser did not support",
		"H0x00003":"A network error caused the video download to fail part-way",
		"H0x00004":"The video could not be loaded, either because the server or network failed or because the format is not supported",
		"H0x00006":"CDN连接失败，请联系网络提供商",
		"H0x00007":"CDN连接失败，请联系网络提供商",
		"H0x10000":"视频播放器错误：HlsError",
		"H0x10001":"LoadError：视频资源加载错误",
		"H0x10002":"ParsingError：视频解析错误",
		"H0x10003":"视频加载失败",
		"H0x10004":"您使用的火狐浏览器没有开启MediaSource。请在浏览器栏输入about:config做如下设置<br>media.mediasource.enabled=true<br>media.mediasource.mp4.enabled=true<br>media.mediasource.whitelist=false",
		"H0x10005":"您的浏览器不支持MediaSourceExtension / MP4 mediasource，建议安装最新版chrome或firefox浏览器 <a href='http://www.imooc.com/static/html/browser.html'>下载浏览器</a>",
		"F0x00007":"CDN连接失败，请联系网络提供商",
		"F0x10002":"ParsingError：视频解析错误",
	}
	
	var error = mocoplayer.error = function(container,code){
		/*
		上报错误代码，不提示用户
		"00x10001":"跨域",
		"00x10004":"火狐浏览器没有开启MediaSource 切flash",
		"00x10005":"浏览器不支持MediaSourceExtension / MP4 mediasource 切flash",
		"00x2000*":"cdn切换",
		"00x3000*":"flash cdn切换",
		*/

		if(typeof(code)=="object"){
			if(code.length==1 && code[0].substr(0,3)=="00x"){
				return code;
			}
		}else{
			if(code.substr(0,3)=="00x"){
				return code;
			}
		}

		var dom = $(container);
		if(dom.length){
			var w = dom.width();
			var h = dom.height();
			var codestr = code;
			var errorstr = [];
			if(typeof(code)=="object"){
				codestr = code.join(",");
				for(var i=0; i<code.length; i++){
					if(errorcode[code[i]]){
						errorstr.push(errorcode[code[i]]);
					}
				}
				if(errorstr.length==0){
					errorstr.push(errorcode["M0x00000"]);
				}
			}else{
				errorstr.push(errorcode[codestr]||errorcode["M0x00000"]);
			}

			$(container).prepend('<div class="mocoplayer-error" style="width:'+w+'px;height:'+h+'px">\
									<div class="mocoplayer-error-content">\
										<span>'+codestr+'</span>'+errorstr.join("<br>")+'<br><a href="//www.imooc.com/about/faq" target="_blank">常见问题</a>　<a href="//www.imooc.com/user/feedback" target="_blank">意见反馈</a>　<a href="//moco.imooc.com/player/report.html" target="_blank">网速测试</a></div>\
								</div>');
		}
		return code;
	}
})(mocoplayer);