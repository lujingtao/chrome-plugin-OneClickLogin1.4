chrome.extension.sendRequest({action:"getSiteInfo"},function( param ){
	
	var obj = param[0];
	var defInfoStorage = param[1]

	if(obj){
		$(".box1 input").val(obj.UserName);
		$(".box2 input").val(obj.Pwd);
		if(obj.Code != ""){
			$(".box3 input").val(obj.Code);
		}
		$("#IbtnEnter").click();
	}
	else{

		//读取默认帐号密码
		if ( typeof defInfoStorage== "string" ){
			var defInfo = JSON.parse(defInfoStorage);

			$("#adminboxmain").prepend('<h1 style=" position: absolute; top: 20px; width: 100%; left: 0; text-align: center;">一键登录：没有对应记录，尝试用默认帐号登录...</h1>');
			$(".box1 input").val( defInfo.oldUser );
			$(".box2 input").val( defInfo.oldPwd );
			$(".box3 input").val( defInfo.oldCode );
			$("#IbtnEnter").click();
		}

	}


});

/*
$("#IbtnEnter").click(function(){ 

	chrome.extension.sendRequest({ action:"getLoginInfo",url:location.href,name:$(".box1 input").val(),pwd:$(".box2 input").val(),code:$(".box3 input").val()  },function(){
		
	});

});
*/