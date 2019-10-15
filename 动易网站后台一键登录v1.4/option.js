//数据记录功能部分来源于“冼国辉的PE一键登录” 

var _back = chrome.extension.getBackgroundPage();
var defInfoStorage = localStorage[_back._DefautlInfo];

//数据绑定
function bindData(){
	var	array = _back.getRecordArray();
	$("#tabRecordlist .trRecord").remove();
	
	for(var i=array.length-1;i>=0;i--){
		var trEven=i%2==0?"":"trEven";
		
		$("#tabRecordlist tr:eq(1)").after("<tr id='tr"+i+"' class='trRecord "+trEven+"'>"+obj2Td(array[i])
			+"<td class='op'><a href='#' class='modify' rel='"+i+"'>修改</a>"
			+"<a class='remove' rel='"+i+"'>删除</a></td></tr>");
	}

	$(".trRecord").hover(function(){
		$(this).addClass("hover")	
	},function(){
		$(this).removeClass("hover")
	});


	//读取默认帐号密码
	if ( typeof defInfoStorage== "string" ){
		var defInfo = JSON.parse(defInfoStorage);
		$("#oldUser").val( defInfo.oldUser );
		$("#oldPwd").val( defInfo.oldPwd );
		$("#oldCode").val( defInfo.oldCode );
		$("#newUser").val( defInfo.newUser );
		$("#newPwd").val( defInfo.newPwd );
		$("#newCode").val( defInfo.newCode );
	}
}

//添加记录
function save(i){
	
	if(!isValid()){ return; }
	var array = _back.getRecordArray();
	var obj = GetReodeObject();
	var index = i;
	
	if(i == null){
		index = hasObject(array,obj);
	}
	
	array[index] = obj;
	_back.setRecordArray(array);
	bindData();
	cancel();

	$("#trOperation").removeClass("trFocus");
}

function modify(i){
	var array = _back.getRecordArray();
	$("#txtSiteName").val(array[i].SiteName);
	$("#txtUrl").val(array[i].Url);
	$("#txtUserName").val(array[i].UserName);
	$("#txtPwd").val(array[i].Pwd);
	$("#txtCode").val(array[i].Code);
	$(".op a").show();
	$("#tr"+i+" .op a").hide();
	$("#trOperation .op").html("<a class='save' rel='"+i+"'>保存</a><a class='cancel' rel='"+i+"'>取消</a>");
	$("#trOperation").addClass("trFocus");
}



function cancel(i){
	$("#trOperation input").val('');
	$("#trOperation input:eq(1)").val("http://");
	$("#trOperation .op").html("<a class='save'>添加</a>");
	if(i !=null){
		$("#tr"+i+" .op a").show();
	}
	$("#trOperation").removeClass("trFocus");
}

function remove(index){
	if(!confirm("确认要删除此网站设置吗？")){
		return;
	}

	var array = _back.getRecordArray();
	array.splice(index,1);
	_back.setRecordArray(array);
	bindData();
}

//查看明文密码
function viewPwd(){
	if ($(this).is(':checked'))
	{
		$(".tdPwd").each(function(){
			$(this).html($(this).attr("rel"))
		});
	}else{
		$(".tdPwd").each(function(){
			$(this).html("******")
		});
	}
}

//检查数组是否有值
function hasObject(array,obj){
	for(var i=0; i<array.length;i++){
		if(array[i].SiteName == obj.SiteName){
			return i;
		}
	}
	return array.length;
}

//检查值
function isValid(){
	var message = [];
	if($("#txtSiteName").val() == ""){message.push("请输入网站名称！");}
	if($("#txtUrl").val() == ""){message.push("请输入后台登录网址！");}
	if($("#txtUserName").val() == ""){message.push("请输入后台管理名！");}
	if($("#txtPwd").val() == ""){message.push("请输入后台管理密码！");}
	if(message.length != 0){
		showMessage(message);
	}
	return message.length == 0;
}


function exporting(){
	$("#divMessage").show().html("<font style='color:black;font-weight:bold;'>请保存以下备份字符串：</font><br /><textarea readonly='readonly'>"+_back.serialize()+"</textarea>");

	location.href=(location.href).split("#")[0]+"#divMessage";
}


//手动备份
function backup(){
	$("#divMessage").show().html("<textarea readonly='readonly'>"+_back.getRecordHmtl()+"</textarea>");
	location.href=(location.href).split("#")[0]+"#divMessage";
}

function importing(){
	var s = prompt("请输入备份字串符：");
	if(s=='') {
		showMessage(["没有数据输入！"]);
		return;
	}
	_back.deserialize(s);
	bindData();
	$("#divMessage").hide();
}

//获取对象
function GetReodeObject(){
	var json = {"SiteName":$("#txtSiteName").val(),"Url":$("#txtUrl").val().toLowerCase(),"UserName":$("#txtUserName").val()
				,"Pwd":$("#txtPwd").val(),"Code":$("#txtCode").val()};
	return json;
}

//显示错误信息
function showMessage(msg){
	$("#divMessage").show().html("<ul><li>" + msg.join("</li><li>") + "</li></ul>");
	setTimeout(function(){$("#divMessage").fadeOut("normal");},2500);
}

function obj2Td(obj){
	
   obj.Code=obj.Code==null?"":obj.Code;
   var s="<td >"+obj.SiteName+"</td>"+"<td style='text-align:left;'><a target='_blank' href='"+ ( obj.Url.toLowerCase() ).replace("login.aspx","index.aspx")+"'>"+obj.Url.toLowerCase()+"</a></td>"+"<td class='tdUserName'>"+obj.UserName+"</td>"
		+"<td class='tdPwd' rel='"+obj.Pwd+"'>"+obj.Pwd+"</td>"+"<td class='tdCode'>"+obj.Code+"</td>";
	return s;
}

//保存默认帐号密码
function saveDefault(){
	var ary = { 
		"oldUser":$("#oldUser").val(),
		"oldPwd":$("#oldPwd").val(),
		"oldCode":$("#oldCode").val(),
		"newUser":$("#newUser").val(),
		"newPwd":$("#newPwd").val(),
		"newCode":$("#newCode").val()
	};
	localStorage[_back._DefautlInfo]=JSON.stringify(ary);
	alert("保存成功");
}

$(document).ready(function(){
	bindData();

	$("#exporting").click(exporting);
	$("#importing").click(importing);
	$("#viewPwd").click(viewPwd);
	$("#saveDefault").click(saveDefault);

	$("#backup").click(backup);
	$(".defaultInfo .hd").click(function(){
		$(this).parent().toggleClass("defaultInfoOn")
	});


	var body = $("body");
	body.on('click','.save',function(){ 
	  save($(this).attr("rel"))
	});

	body.on('click','.modify', function() {
		modify($(this).attr("rel"))
	});
	body.on('click','.remove', function() {
		remove($(this).attr("rel"))
	});
	body.on('click','.cancel', function() {
		cancel($(this).attr("rel"))
	});



});


