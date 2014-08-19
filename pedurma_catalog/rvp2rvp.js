//var fs=require("fs");
var dosearch=function(volpage){
	reset();
	var form=document.getElementById("form_name");
		if(form.version.value=="J"){
			search(volpage,jPedurma,dPedurma);
		}
		if(form.version.value=="D"){
			search(volpage,dPedurma,jPedurma);
		}
}

var search=function(volpage,from,to){
	if(volpage.match("[@.]")){//如果輸入是volpage的話
		var corresFromVolpage=fromVolpage(volpage,from,to);
		showResult_Volpage(corresFromVolpage);
		//corresFromVolpage= [經號],[範圍],[對照經號],[對照範圍],[對照行],[K經號]
		searchNameCh(corresFromVolpage[5],from,to);
		searchName(corresFromVolpage[5]);
	} else {//如果輸入是經號的話
		var corresJing=fromJing(volpage,from,to);
		showResult_Jing(volpage,corresJing);
		//corresJing=[自己範圍,對照經號,對照範圍,K經號]
		searchNameCh(corresJing[0][3],from,to);
		searchName(corresJing[0][3]);
	}
}

var showResult_Jing=function(volpage,result){//result=[自己範圍,對照經號,對照範圍]
	document.getElementById("Jing").innerHTML=volpage;
	document.getElementById("corresJing").innerHTML=result[0][1];
	document.getElementById("range").innerHTML=result[0][0];
	document.getElementById("corresRange").innerHTML=result[0][2];
	// document.getElementById("corresLine").innerHTML="";

}

var showResult_Volpage=function(result){//result=[經號],[範圍],[對照經號],[對照範圍],[對照行]
	document.getElementById("Jing").innerHTML=result[0];
	document.getElementById("range").innerHTML=result[1];
	document.getElementById("corresJing").innerHTML=result[2];
	document.getElementById("corresRange").innerHTML=result[3];
	document.getElementById("corresLine").innerHTML=result[4];
}

var fromJing=function(Jing,from,to){
	var out=[];
	var j=0;
	//從J的經號得到K的經號
	//從K的經號得到D的經號和頁碼
	for(var i =0; i<from.length; i++){
		if(Jing == from[i][0]){
			var KJing=from[i][2];		
			for(var j=0; j<to.length; j++){
				if(KJing == to[j][2]){
					var corresJing=to[j][0];
					var corresRange=to[j][1];
					out.push([from[i][1],corresJing,corresRange,KJing]);
					//break;
				} //else document.getElementById("warning").innerHTML="not exsist";
				
			}
			break;
		}
	}
	return out;//[自己範圍,對照經號,對照範圍,K經號]
}

var fromVolpage=function(volpage,from,to){
	//var volpage=document.getElementById("input").value;
	var out=[];
	var range=findRange(volpage,from);//range=[J經號,J範圍,K經號]
	var corres_range=findCorresRange(range[2],to);//corres_range=[D經號,D範圍]
	//算J和D的範圍
	var vRange=countRange(range[1]);//[vStart,vEnd-vStart]
	var corres_vRange=countRange(corres_range[0][1]);//[vStart,vEnd-vStart]
	var corresLine=countCorresLine(volpage,vRange[1],corres_vRange[1],vRange[0],corres_vRange[0]);

	out.push([range[0]],[range[1]],[corres_range[0][0]],[corres_range[0][1]],[corresLine],[range[2]]);
				// [經號],[範圍],[對照經號],[對照範圍],[對照行],[K經號]
	return out;
}

var countCorresLine=function(volpage,range,corres_range,start,corres_start){//volpage=使用者輸入的volpage
	var Vline=volpb2vl(volpage);
	var corres_vLine=(range*corres_start+corres_range*(Vline-start))/range;//對照的虛擬行
	corres_vLine=Math.floor(corres_vLine);
	var corresLine=vl2volpb(corres_vLine);//對照的虛擬行轉回volpage
	return corresLine;
}

var countRange=function(range){//range=034@020a1-103b7
	var p=range.split("-");
	var start=p[0];
	var vStart=volpb2vl(start);
	var end=p[0].substr(0,3)+"."+p[1];
	var vEnd=volpb2vl(end);
	//var vRange=vEnd-vStart;
	var vRange=[vStart,vEnd-vStart];

	return vRange;
}


var findCorresRange=function(KJing,to){
	var out=[];
	for(var i=0; i<to.length; i++){
		if(KJing == to[i][2]){
			out.push([to[i][0],to[i][1]]);
		}
	}
	return out;
}

var findRange=function(volpage,from){
	var out=[];
	var Pedurma=startline2vline(from);
	//將輸入轉為vline，找出此行所在的範圍
	//for(var i=0; i<input.length; i++){}
	var input_vline=volpb2vl(volpage);
	for(var k=0; k<Pedurma.length; k++){
		if(input_vline < Pedurma[k][1]){
			out=from[k-1];//此行所在的範圍的[J經錄,J範圍,K經錄]
			break;
		}
	}
	return out;
}

//Pedurma的起始行轉vline
var startline2vline=function(from){
	var out=[];
	for(var j=0; j<from.length; j++){
		var p=from[j][1].split("-");
		start=p[0];
		var start_vline=volpb2vl(start);
		out.push([from[j][0],start_vline]);//[經號,起始行的vline]
	}
	return out;
}

var rvp2Vline=function(){
	var out=[];
	var pageRange=rvp2rvp();
	for(var i=0;i<pageRange.length; i++){
		var s=parseVolPage(pageRange[i][1]);
		out.push(s);
	}
	return out;
}

var parseVolPage=function(str){
	var s=str.match(/(\d+)[@.](\d+)([abcd])(\d*)/);
	//var s=str.match(/(\d+)[@.](\d+)([abcd])(\d*)-*(\d*)([abcd]*)(\d*)/);
	if(!s){
		console.log("error!",str);
		return null;
	}
	return {vol:parseInt(s[1]),page:parseInt(s[2]),side:s[3],line:parseInt(s[4]||"1")};
	//return {vol:parseInt(s[1]),page:parseInt(s[2]),side:s[3],line:parseInt(s[4]||"1"),page2:parseInt(s[5]),side2:s[6],line2:parseInt(s[7]||"1")};
}

var volpb2vl=function(str){
	var out=[];
	var volpage=parseVolPage(str);
	if(! volpage){console.log(str); return 0;}
	if(volpage["side"]=="a"){side=1;}
	else if(volpage["side"]=="b"){side=2;}
	else if(volpage["side"]=="c"){side=3;}
	else if(volpage["side"]=="d"){side=4;}
	
	var vline=volpage["vol"]*500*4*10+volpage["page"]*4*10+side*10+volpage["line"];
	
	return vline;
}

var vl2volpb=function(vline){
	var vol=Math.floor(vline/(500*4*10));
	var page_p=vline%(500*4*10);
	var page=Math.floor(page_p/(4*10));
	var side_p=page_p%(4*10);
	var side=Math.floor(side_p/10);
	var line=side_p%10;
	if(side==0){side="a";}
	else if(side==1){side="b";}
	else if(side==2){side="c";}
	else if(side==3){side="d";}
	var volpb=vol+"."+page+side+line;

	return volpb;
}

var searchNameCh=function(KJing,from,to){
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
			document.getElementById("nameCh").innerHTML=result.join("、");
			break;
		}
	}
}

var searchName=function(KJing){
	for(var i=0; i<sutranames.length;i++){
		if(KJing == sutranames[i][0]){
			document.getElementById("name").innerHTML=sutranames[i][1];
		}
	}
}

var taisho2taishoName=function(taisho){ //把pedurma_taisho裡的taisho號碼轉換為經名
	for(var i=0;i<taishonames.length;i++){
		var taishoNum=parseInt(taishonames[i][0].substr(taishonames[i][0].length-4));
		if(parseInt(taisho) == taishoNum){
			return taishonames[i];//[T01n0001,經名]
		}
	}
}

var addLink=function(link,name){
		return '<a target=_new href="http://tripitaka.cbeta.org/'+link+'">'+name+"</a>";
}

var reset=function(){
	document.getElementById("Jing").innerHTML="";
	document.getElementById("corresJing").innerHTML="";
	document.getElementById("range").innerHTML="";
	document.getElementById("corresRange").innerHTML="";
	document.getElementById("corresLine").innerHTML="";
	document.getElementById("name").innerHTML="";
	document.getElementById("nameCh").innerHTML="";
	document.getElementById("warning").innerHTML="";
}


