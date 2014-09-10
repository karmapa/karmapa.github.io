//把data轉換為二進位
//doCalculate 使用者輸入版本 將此版本組合轉換為二進位，此為mask 以filter檢查
var $id=document.getElementById;

var doCalculate=function(){
	var arr=[];
	var res=[];
	var form=document.getElementById("form");
	var form2=document.getElementById("form2");
	for(var i=0; i<form.recension.length; i++){
		if(form.recension[i].checked){
			arr.push(form.recension[i].value);
		}
	}
	var mask=packMask(arr);//mask使用者輸入版本的mask數字
	if(form2.calculate.value=="intersect") res=intersect(mask);
	if(form2.calculate.value=="unique") res=unique(mask);
	var out=renderSutraList(res);
	document.getElementById("amount").innerHTML=out.length;
	document.getElementById("result").innerHTML=out.join("<br>");
}
//mask 以mask遮照相乘data若 mask*data=mask則符合
var intersect=function(mask){
	var res=[]; 
	data_bi.forEach(function(d){
		if ((d[1] & mask) === mask) res.push([d[0],d[1]])
	});
	return res;
}
var unique=function(mask){
	var res=[];
	data_bi.forEach(function(d){
		if (d[1]  === mask) res.push([d[0],d[1]])
	});
	return res;
}
var renderSutraList=function(result){
	var out=[];
	var link="file:///Users/yu/dev2014/karmapa.github.io/pedurma_catalog/page_map.html?ck=";
	//"http://karmapa.github.io/pedurma_catalog/page_map.html?ck="
	for(var i=0; i<result.length; i++){
			var name=addSutraName(result[i][0]);
			var recen=unpackMask(result[i][1]);
			out.push('<li><a target=_new href="'+link+result[i][0]+'">'+result[i][0]+". "+name+"</a>"+":"+recen+"</li>");
	}
	return out;
}

var packMask=function(allRecen){
	var mask=0;
	for(var j=0; j<allRecen.length; j++){//data[i][1].length
		if(allRecen[j] == "D") mask+=32;
		if(allRecen[j] == "U") mask+=16;
		if(allRecen[j] == "N") mask+=8;
		if(allRecen[j] == "H") mask+=4;
		if(allRecen[j] == "C") mask+=2;
		if(allRecen[j] == "J") mask+=1;
	}
	return mask;
}

var unpackMask=function(mask){
	var recen="";
	if( ((mask >> 5) & 1) === 1 ) recen+="D ";
	if( ((mask >> 4) & 1) === 1 ) recen+="U ";
	if( ((mask >> 3) & 1) === 1 ) recen+="N ";
	if( ((mask >> 2) & 1) === 1 ) recen+="H ";
	if( ((mask >> 1) & 1) === 1 ) recen+="C ";
	if( ( mask       & 1) === 1 ) recen+="J ";
	return recen;
}

var addSutraName=function(Jing){
	for(var i=0; i<sutranames.length; i++){
		if(Jing == sutranames[i][0]){
			return sutranames[i][1];
			break;
		}
	}
}
