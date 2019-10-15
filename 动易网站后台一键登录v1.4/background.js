var _RecordArrayKey = "ZX_OneClickLogin_RecordArray";
var _DefautlInfo = _RecordArrayKey+"_DefautlInfo";
var url ="";
var isSA=false;//是否新系统
var o=null; //post对象
var repSite="";
var repUrl="";
var repName="";
var repPwd="";
var repCode="";
var req = 0;//请求次数
var recObj = null;


//获取本地记录集
function getRecordArray(){
	if(localStorage.hasOwnProperty(_RecordArrayKey)){
		var s = localStorage[_RecordArrayKey];
		return JSON.parse(Base64.decrypt(s));
	}
	else{ return []; }
}

//设置本地记录集
function setRecordArray(array){
	localStorage[_RecordArrayKey] = Base64.encrypt(JSON.stringify(array));
}

//获取网站信息对象
function getSiteInfo(url){
	var array = getRecordArray();
	if (url == null){return;}
	for(var i = 0; i<array.length;i++){
		if( ( array[i].Url ).split("/")[2].toLowerCase() == url.toLowerCase()){
			return array[i];
		}
	}
	return null;
}

//序列化
function serialize(){
	return localStorage[_RecordArrayKey];
}

//反序列化
function deserialize(s){
	if(s == null || s ==''){
		return false;}
	localStorage[_RecordArrayKey] = s;
}

//明文备份
function getRecordHmtl(){
	var	array = getRecordArray();
	var html ="";
	for(var i=array.length-1;i>=0;i--){
		array[i].Code=array[i].Code==null?"":array[i].Code;
		html += array[i].SiteName+"*********************\n\r";
		html += "后台地址："+array[i].Url+"\n";
		html += "用户名："+array[i].UserName+"\n";
		html += "密码："+array[i].Pwd+"\n";
		html += "验证码："+array[i].Code+"\n\r\r";
	}
	return html;
}


//=======================================


//初始化默认帐号密码
if ( typeof localStorage[_DefautlInfo] != "string" ){
	var ary = {
		"oldUser":"*",
		"oldPwd":"*",
		"oldCode":"*",
		"newUser":"*",
		"newPwd":"*",
		"newCode":"*"
	};
	localStorage[_DefautlInfo]=JSON.stringify(ary);
}



//图标点击-程序开始
chrome.browserAction.onClicked.addListener(function(tab) {

	url = (tab.url).split("/")[2];

	recObj = getSiteInfo(url);

	//有记录情况下
	if( recObj ){
		url = recObj.Url
		chrome.tabs.create( { url:url }, function(){
				chrome.tabs.onUpdated.addListener( function tempUpdateListener( tabId, info, tab ) {
						chrome.tabs.onUpdated.removeListener(tempUpdateListener);

						chrome.tabs.executeScript(null,{file:"jquery.js"});
						chrome.tabs.executeScript(null,{file:"isSiteAzure.js"},function(){});

				});//onUpdated
		});//create

	}else{

		chrome.tabs.executeScript(null,{file:"jquery.js"});
		chrome.tabs.executeScript(null,{file:"isSiteAzure.js"},function(){});

	}
});

//自动登录旧系统
function postData(){
		req++;
		chrome.tabs.executeScript(null,{file:"jquery.js"});
		chrome.tabs.executeScript(null,{file:"loginSite.js"},function(){
			chrome.tabs.onUpdated.removeListener(addRecrodLister);
			chrome.tabs.onUpdated.addListener(addRecrodLister);
		});
 }

//自动登录新系统
function postData_SA(){
		req++;
		chrome.tabs.executeScript(null,{file:"jquery.js"});
		chrome.tabs.executeScript(null,{file:"loginSiteAzure.js"},function(){});
 }

//onRequest监听
chrome.extension.onRequest.addListener(function(msg, sender, responseFunc){
	if(msg.action == "getSiteInfo" && req==1 ){
		responseFunc([recObj, localStorage[_DefautlInfo] ]);
	}
	else if(msg.action == "getLoginInfo"){
		repUrl = url;
		repName=msg.name;
		repPwd=msg.pwd;
		repCode=msg.code;
	}

	else if(msg.action == "isSiteAzure"){
		isSA = msg.sa;


		//新系统执行
		if ( isSA ){

			if( recObj ){ req=0; postData_SA(); }
			else{
				url = "http://"+url+ "/manage/index";
				chrome.tabs.create( { url:url }, function(){
						chrome.tabs.onUpdated.addListener( function tempUpdateListener( tabId, info, tab ) {
								chrome.tabs.onUpdated.removeListener(tempUpdateListener);
								if( tab.url.split("/").pop().toLowerCase()=="index" ){   }
								else if( tab.url.split("/").pop().toLowerCase()=="login"){ req=0; postData_SA(); }

						});//onUpdated
				});//create
			}
		}
		//旧系统执行
		else{

			if( recObj ){ req=0; postData(); }
			else{
				url = "http://"+url+ "/admin/Index.aspx";
				chrome.tabs.create( { url:url }, function(){
						chrome.tabs.onUpdated.addListener( function tempUpdateListener( tabId, info, tab ) {
								chrome.tabs.onUpdated.removeListener(tempUpdateListener);
								if( tab.url.split("/").pop()=="Index.aspx" || tab.url.split("/").pop()=="index.aspx" ){ chrome.tabs.executeScript(null,{code:'document.getElementById("left").src="Contents/CategoryGuide.aspx"'});  }
								else if( tab.url.split("/").pop()=="Login.aspx" || tab.url.split("/").pop()=="login.aspx" ){ req=0; postData(); }

						});//onUpdated
				});//create
			}

		}

	}

});

//检查数组是否有值
function getAryIndex(array){
	for(var i=0; i<array.length;i++){
		if(array[i].Url.toLowerCase() == url.toLowerCase()){
			return i;
		}
	}
	return array.length;
}

//添加记录
function saveRec(){
	/*
	var array = getRecordArray();
	//repSite = recObj==null?"自动添加":recObj.SiteName;
	if( recObj ){ repSite=recObj.SiteName }
	var obj = {"SiteName":repSite,"Url":repUrl.toLowerCase(),"UserName":repName,"Pwd":repPwd,"Code":repCode};
	array[ getAryIndex(array) ] = obj;
	 if( req>1 && recObj!=null  ){ setRecordArray(array); showMessage("update") }
	 else if( recObj==null ){ setRecordArray(array); showMessage("add"); }
	 */
}

//建立监听并添加记录
function addRecrodLister( tabId, info, tab ) {

		var popUrl = tab.url.split("/").pop();
		if( popUrl =="Index.aspx" || popUrl =="index.aspx" ){ saveRec(); chrome.tabs.executeScript(null,{code:'document.getElementById("left").src="Contents/CategoryGuide.aspx"'}); chrome.tabs.onUpdated.removeListener(addRecrodLister); }
		else if( popUrl =="IndexGuide.aspx" || popUrl =="indexGuide.aspx" ){ chrome.tabs.executeScript(null,{code:'document.getElementById("BtnSkip").click()'});  }
		//else if( popUrl =="Login.aspx" || popUrl =="login.aspx" ){ if( req==1 && recObj!=null ){  showMessage("wrong") } postData() }
		else{ chrome.tabs.onUpdated.removeListener(addRecrodLister); }
}

//信息提示
function showMessage( type ){
	/*
	switch( type ){
		case "add":
			webkitNotifications.createNotification( 'images/logo48.png',  '添加成功',  '系统已添加这个网站账号，下次就能一键登录了！'  ).show(); break;
		case "update":
			webkitNotifications.createNotification( 'images/logo48.png',  '更新成功',  '一键登录账号已更新了！'  ).show(); break;
		case "wrong":
			webkitNotifications.createNotification( 'images/logo48.png',  '错误',  '一键登录账号错误，输入正确后系统会自动更新！'  ).show(); break;

	}*/
}

//标签切换，取消onUpdated监听
chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
	chrome.tabs.onUpdated.removeListener(addRecrodLister);
});
