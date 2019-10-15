var issa=false;

var href = $("link[rel=stylesheet]").first().attr("href");

if(href){
	var hrefAry=  $("link").first().attr("href").split("/");

	if (  hrefAry[1].toLowerCase()=="content" || hrefAry[2].toLowerCase()=="content" ){
		issa=true;
	}
}

chrome.extension.sendRequest({ action:"isSiteAzure",sa:issa },function(){
	
});


