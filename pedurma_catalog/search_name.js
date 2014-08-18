var dosearch=function(tofind){
	var ChResult=searchSutra(tofind,taishonames,1);//搜尋字,搜尋的陣列taishonames=中文 sutranames=藏文
	var result=searchSutra(tofind,sutranames,0);//0,1用來讓藏文結果先不加連結 0不加 1加
	if(ChResult.length != 0){
		document.getElementById("result").innerHTML=ChResult.join("<br>");
	} else {
		document.getElementById("result").innerHTML=result.join("<br>");
	}
}

var searchSutra=function(tofind,language,linkOrNot){//linkOrNot用途：若搜尋藏文則先不用加連結
	var out=[];
	for(var i=0; i<language.length; i++){
		if(language[i][1]){
			if(language[i][1].indexOf(tofind)>-1){
				var result=addLink(language[i][0],language[i][1],linkOrNot);//linkOrNot用途：若搜尋藏文則先不用加連結
				out.push(result);
			} 
		}
	}
	return out;
}

var addLink=function(link,name,linkOrNot){//linkOrNot用途：若搜尋藏文則先不用加連結
	if(linkOrNot == 1){
		return '<a href="http://tripitaka.cbeta.org/'+link+'">'+name+"</a>";
	} else {
		return name;
	}
}