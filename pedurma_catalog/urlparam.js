var jingSearch=function(input){
	var out=[];
	renderCKJing(input);
	for(var i in mappings){
		for(var j=0; j<mappings[i].length; j++){
			if(mappings[i][j][2] == input){
				var range=mappings[i][j][1];
				var l=mappings[i][j][1].split("-");
				var line=l[0];
				renderJing(i,mappings[i][j][0],range,line);
			}
		}
	}
	//console.log(out);
	return out;
}
var renderCKJing=function(input){
	var r=0;
	for(var i=0; i<kPedurma.length; i++){
		if(parseInt(kPedurma[i][0]) == parseInt(input)){
			r=kPedurma[i][1]; 
			break;
		} 
	}
	document.getElementById("from").innerHTML="CK";
	document.getElementById("Jing").innerHTML=input;
	//document.getElementById("range").innerHTML=r;
	document.getElementById("name").innerHTML=addSutraName(input);
	document.getElementById("nameCh").innerHTML=searchNameCh(input);
}
var renderJing=function(recen,jing,range,line){
	if(recen == "D"){
		document.getElementById("toD").innerHTML="Derge";
		document.getElementById("JingD").innerHTML=jing;
		//document.getElementById("RangeD").innerHTML=range;
		document.getElementById("LineD").innerHTML=line;
	}
	if(recen == "U"){
		document.getElementById("toU").innerHTML="Urga";
		document.getElementById("JingU").innerHTML=jing;
		//document.getElementById("RangeU").innerHTML=range;
		document.getElementById("LineU").innerHTML=line;
	}
	if(recen == "N"){
		document.getElementById("toN").innerHTML="Narthang";
		document.getElementById("JingN").innerHTML=jing;
		//document.getElementById("RangeN").innerHTML=range;
		document.getElementById("LineN").innerHTML=line;
	}
	if(recen == "H"){
		document.getElementById("toH").innerHTML="Lhasa";
		document.getElementById("JingH").innerHTML=jing;
		//document.getElementById("RangeH").innerHTML=range;
		document.getElementById("LineH").innerHTML=line;
	}
	if(recen == "C"){
		document.getElementById("toC").innerHTML="Cone";
		document.getElementById("JingC").innerHTML=jing;
		//document.getElementById("RangeC").innerHTML=range;
		document.getElementById("LineC").innerHTML=line;
	}
	if(recen == "J"){
		document.getElementById("toJ").innerHTML="Lijiang";
		document.getElementById("JingJ").innerHTML=jing;
		//document.getElementById("RangeJ").innerHTML=range;
		document.getElementById("LineJ").innerHTML=line;
	}
}

var addSutraName=function(Jing){
	for(var i=0; i<sutranames.length; i++){
		if(Jing == sutranames[i][0]){
			return sutranames[i][1];
			break;
		}
	}
}

var searchNameCh=function(KJing){
	//判斷輸入是J版本還是D版本再依其版本取得K
	//在pedurma_taisho從K值轉換成中文經號
	var result=[];
	for(var i=0;i<pedurma_taisho.length;i++){
		if(KJing==pedurma_taisho[i][0]){
			var taisho=pedurma_taisho[i][1].split(",");  ////對照到中有多個經時

			for(var j=0;j<taisho.length;j++){
				//回去taishonames找到該項，得到中文經名
				var taishoNumName=taisho2taishoName(taisho[j]);//[T01n0001,經名]
				//將中文經名加上超連結
				result.push(addLink(taishoNumName[0],taishoNumName[1]));
			}
			return result.join("、");
		}
	}
}

var addLink=function(link,name){
	if(link.match(/T0.n0220/)){
		link=link.substr(0,link.length-1);
	}
	return '<a target=_new href="http://tripitaka.cbeta.org/'+link+'">'+name+"</a>";
}

jingSearch(window.location.search.substr(4));
//console.log(window.location.search);