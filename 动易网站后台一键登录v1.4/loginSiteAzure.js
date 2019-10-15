chrome.extension.sendRequest({action:"getSiteInfo"},function(param){
	
	var obj = param[0];
	var defInfoStorage = param[1]

	if(obj){
		
		$("#LoginAdminName").val(obj.UserName);
		$("#LoginAdminPassword").val(obj.Pwd);
		if(obj.Code != ""){
			$("#SiteManageCode").val(obj.Code);
		}
		$(".btn-primary").click();
	}
	else{

		//读取默认帐号密码
		if ( typeof defInfoStorage== "string" ){
			var defInfo = JSON.parse(defInfoStorage);

			$("#login-part .in").prepend('<h3 style="z-index: 99;position: absolute;top: -90px;width: 140%;left: -20%;text-align: center;color: #fff;">一键登录：没有对应记录，尝试用默认帐号登录...</h3>');
			$("#LoginAdminName").val(defInfo.newUser);
			$("#LoginAdminPassword").val(defInfo.newPwd);
			$("#SiteManageCode").val(defInfo.newCode);
			$(".btn-primary").click();

		}


	}


});


