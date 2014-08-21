var dosearch=function(tofind){
	var ChResult=searchSutra(tofind,taishonames,1);//搜尋字,搜尋的陣列taishonames=中文 sutranames=藏文
	var result=searchSutra(tofind,sutranames,0);//0,1用來讓藏文結果先不加連結 0不加 1加
	if(ChResult.length != 0){
		document.getElementById("result").innerHTML=ChResult.join("<br>");
		document.getElementById("result_num").innerHTML=ChResult.length+"筆搜尋結果";
	} else {//搜尋不到中文結果 也就是輸入是藏文
		document.getElementById("result").innerHTML=result.join("");
		document.getElementById("result_num").innerHTML=result.length+"筆搜尋結果";
	}
}

var searchSutra=function(tofind,language,linkOrNot){//linkOrNot用途：若搜尋藏文則先不用加連結
	var out=[];
	var searchword=new RegExp(tofind,"g");
	for(var i=0; i<language.length; i++){
		if(language[i][1]){
			var find=language[i][1].match(tofind);
			if(find){
				var result_color=language[i][1].replace(searchword,changecolor);//加上塗紅的搜徐結果
				if(language.length == 1122){//如果搜尋藏文的話 經號也要顯示
					var result="<li>"+result_color+"("+language[i][0]+")"+"</li>";
				}
				else{
					var result=addLink(language[i][0],result_color);//linkOrNot用途：若搜尋藏文則先不用加連結
				}
				
				 out.push(result);//若是搜尋中文則不用顯示經號
			}
		}
	}
	return out;
}

var addLink=function(link,name,linkOrNot){//linkOrNot用途：若搜尋藏文則先不用加連結
	return '<li><a target=_new href="http://tripitaka.cbeta.org/'+link+'">'+name+"</a></li>";
}

var changecolor=function(tofind){
	return '<span class="tofind">'+tofind+'</span>';
}