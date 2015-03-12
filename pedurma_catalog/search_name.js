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
					var chName=corresName(language[i][0]);//[中文經號,中文經名]
					var chNameLink=addLink_no_li(chName[0],chName[1]);
					var result="<li>第"+language[i][0]+"經："+result_color+chNameLink+"</li>";//+chNameLink
				}
				else{
					var KJing=parseInt(language[i][0].substr(4));
					var result=addLink(language[i][0],result_color,KJing);//linkOrNot用途：若搜尋藏文則先不用加連結
				}
				
				 out.push(result);//若是搜尋中文則不用顯示經號
			}
		}
	}
	return out;
}

var corresName=function(KJing){
	var out=[];
	for(var i=0; i<pedurma_taisho.length; i++){
		if(KJing == pedurma_taisho[i][0]){
			var taisho=parseInt(pedurma_taisho[i][1]);
			for(var j=0; j<taishonames.length; j++){
				var taishoNum=parseInt(taishonames[j][0].substr(4,4));
				if(taisho == taishoNum){
					out=[taishonames[j][0],taishonames[j][1]];//中文經號,中文經名
					
				}
			}
		}
	}
	return out;
}

var addLink=function(link,name,KJing){//linkOrNot用途：若搜尋藏文則先不用加連結
	var res="";
	for(var i=0; i<pedurma_taisho.length; i++){
		var taishoJing=pedurma_taisho[i][1].split(",");
		for(var k=0; k<taishoJing.length; k++){
			if(parseInt(taishoJing[k])==KJing){
				var sutra=parseInt(pedurma_taisho[i][0]);
				for(var j=0; j<sutranames.length; j++){
					var sutraNum=parseInt(sutranames[j][0]);
					if(sutra == sutraNum){
						res='<li>第'+sutranames[j][0]+'經：<a target=_new href="http://tripitaka.cbeta.org/'+link+'">'+name+"</a>("+sutranames[j][1]+")</li>";
						//out=[taishonames[j][0],taishonames[j][1]];//中文經號,中文經名
						
					} 
				}
			}
		}
	}
	if(!res) res='<li><a target=_new href="http://tripitaka.cbeta.org/'+link+'">'+name+"</a></li>";
	return res;
}

var addLink_no_li=function(link,name){
	link = link || 0;
	name = name || 0;
	if(link == 0 || name == 0){
		return "";
	} else {
		return '(<a target=_new href="http://tripitaka.cbeta.org/'+link+'">'+name+"</a>)";
	}
}

var changecolor=function(tofind){
	return '<span class="tofind">'+tofind+'</span>';
}