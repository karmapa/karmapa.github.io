	// <INPUT TYPE="radio" NAME="version" VALUE=1 CHECKED>J
	// 	<span id="J_jing"></span>
	// 	<span id="J_page"></span>	
	// <INPUT TYPE="radio" NAME="version" VALUE=2>D
	// 	<span id="D_jing"></span>
	// 	<span id="D_page"></span>
	// <INPUT TYPE="radio" NAME="version" VALUE=3>T
	// 	<span id="T_jing"></span>
	// 	<span id="T_page"></span>


//var fs=require("fs");
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
//var vline=require("./vline_for_search");
// var jPedurma=JSON.parse(fs.readFileSync("./j-pedurma.json","utf8"));
// var dPedurma=JSON.parse(fs.readFileSync("./d-pedurma.json","utf8"));
// var input=JSON.parse(fs.readFileSync("./input.json","utf8"));


var fromJing=function(){
	var out=[];
	var j=0;
	//從J的經號得到K的經號
	//從K的經號得到D的經號和頁碼
	for(var i =0; i<jPedurma.length; i++){
		for(var j=0; j<dPedurma.length; j++){
			if(jPedurma[i][2] == dPedurma[j][2]){
				var D=dPedurma[j][0];
				var Dpage=dPedurma[j][1];
				out.push([D,Dpage]);
				break;
			}
			
		}
	}
	return out;//[D經號,Dpage range]
}


var fromVolpage=function(){
	var volpage=document.getElementById("input").value;
	var range=findRange(volpage);//range=[J經號,J範圍,K經號]
	var corres_range=findCorresRange(range[2]);//corres_range=[D經號,D範圍]
	//算J和D的範圍
	var vRange=countRange(range[1]);//[vStart,vEnd-vStart]
	var corres_vRange=countRange(corres_range[0][1]);//[vStart,vEnd-vStart]
	var corresLine=countCorresLine(volpage,vRange[1],corres_vRange[1],vRange[0],corres_vRange[0]);
	console.log(vRange,corres_vRange);
	document.getElementById("range").innerHTML=range[0]+","+range[1];
	document.getElementById("corresRange").innerHTML=corres_range.join("<br>");
	document.getElementById("corresLine").innerHTML=corresLine;
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


var findCorresRange=function(KJing){
	var out=[];
	for(var i=0; i<dPedurma.length; i++){
		if(KJing == dPedurma[i][2]){
			out.push([dPedurma[i][0],dPedurma[i][1]]);
		}
	}
	return out;
}

//Pedurma的起始行轉vline
var startline2vline=function(){
	var out=[];
	for(var j=0; j<jPedurma.length; j++){
		var p=jPedurma[j][1].split("-");
		start=p[0];
		var start_vline=volpb2vl(start);
		out.push([jPedurma[j][0],start_vline]);//[經號,起始行的vline]
	}
	return out;
}

var findRange=function(volpage){
	var out=[];
	var Pedurma=startline2vline();
	//將輸入轉為vline，找出此行所在的範圍
	//for(var i=0; i<input.length; i++){}
	var input_vline=volpb2vl(volpage);
	for(var k=0; k<Pedurma.length; k++){
		if(input_vline < Pedurma[k][1]){
			out=jPedurma[k-1];//此行所在的範圍的[J經錄,J範圍,K經錄]
			break;
		}
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



var range2vline=function(){

}

//console.log(fromVolpage());
