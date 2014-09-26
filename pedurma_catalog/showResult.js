var showResult_Jing_from=function(result){
	document.getElementById("Jing").innerHTML=result[0][0];
}

var showResult_Jing=function(volpage,result){//result=[自己範圍,對照經號,對照範圍]
	document.getElementById("Jing").innerHTML=volpage;
	document.getElementById("corresJing").innerHTML=result[0][1];
	var ran=parseVolPageRange(result[0][0]);
	//document.getElementById("range").innerHTML="volpage:"+ran.vol+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;page:"+ran.page+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+ran.side+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+ran.line+" ~ page:"+ran.page2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+ran.side2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+ran.line2;
	var cran=parseVolPageRange(result[0][2]);
	document.getElementById("corresRange").innerHTML="volpage:"+cran.vol+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;page:"+cran.page+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+cran.side+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+cran.line+" ~ page:"+cran.page2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+cran.side2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+cran.line2;
	// document.getElementById("corresLine").innerHTML="";

}

var showResult_Volpage_from=function(result){
	document.getElementById("Jing").innerHTML=result[0][0];
	var ran=parseVolPageRange(result[1][0]);
	//document.getElementById("range").innerHTML="volpage:"+ran.vol+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;page:"+ran.page+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+ran.side+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+ran.line+" ~ page:"+ran.page2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+ran.side2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+ran.line2;	
}

var showResult_Volpage=function(result,to){//result=[經號],[範圍],[對照經號],[對照範圍],[對照行]

	if(to.rcode == "J"){//jPedurma
		document.getElementById("toJ").innerHTML="Lijiang";
		document.getElementById("JingJ").innerHTML=result[2];
		var cran=parseVolPageRange(result[3][0]);
		//document.getElementById("RangeJ").innerHTML="volpage:"+cran.vol+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;page:"+cran.page+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+cran.side+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+cran.line+" ~ page:"+cran.page2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+cran.side2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+cran.line2;
		var res=parseVolPage(result[4][0]);
		var image=showImage(res,to);
		document.getElementById("LineJ").innerHTML="volpage:"+res.vol+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;page:"+res.page+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+res.side+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+res.line;
		document.getElementById("PicJ").innerHTML=image;
	}
	if(to.rcode == "D"){//dPedurma
		document.getElementById("toD").innerHTML="Derge";
		document.getElementById("JingD").innerHTML=result[2];
		var cran=parseVolPageRange(result[3][0]);
		//document.getElementById("RangeD").innerHTML="volpage:"+cran.vol+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;page:"+cran.page+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+cran.side+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+cran.line+" ~ page:"+cran.page2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+cran.side2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+cran.line2;
		var res=parseVolPage(result[4][0]);
		var image=showImage(res,to);
		document.getElementById("LineD").innerHTML="volpage:"+res.vol+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;page:"+res.page+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+res.side+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+res.line;
		document.getElementById("PicD").innerHTML=image;	
	}
	if(to.rcode == "C"){//cPedurma
		document.getElementById("toC").innerHTML="Cone";
		document.getElementById("JingC").innerHTML=result[2];
		var cran=parseVolPageRange(result[3][0]);
		//document.getElementById("RangeC").innerHTML="volpage:"+cran.vol+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;page:"+cran.page+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+cran.side+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+cran.line+" ~ page:"+cran.page2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+cran.side2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+cran.line2;
		var res=parseVolPage(result[4][0]);		
		var imageC=showImage(res,to);
		document.getElementById("LineC").innerHTML="volpage:"+res.vol+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;page:"+res.page+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+res.side+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+res.line;
		document.getElementById("PicC").innerHTML=imageC;	
	}
	if(to.rcode == "K"){//kPedurma
		document.getElementById("toK").innerHTML="Pedurma";
		document.getElementById("JingK").innerHTML=result[2];
		var cran=parseVolPageRange(result[3][0]);
		//document.getElementById("RangeK").innerHTML="volpage:"+cran.vol+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;page:"+cran.page+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+cran.side+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+cran.line+" ~ page:"+cran.page2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+cran.side2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+cran.line2;
		var res=parseVolPage(result[4][0]);	
		var imageK=showImage(res,to);
		document.getElementById("LineK").innerHTML="volpage:"+res.vol+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;page:"+res.page+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+res.side+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+res.line;
		document.getElementById("PicK").innerHTML=imageK;
	}
	if(to.rcode == "N"){//nPedurma
		document.getElementById("toN").innerHTML="Narthang";
		document.getElementById("JingN").innerHTML=result[2];
		var cran=parseVolPageRange(result[3][0]);
		//document.getElementById("RangeN").innerHTML="volpage:"+cran.vol+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;page:"+cran.page+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+cran.side+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+cran.line+" ~ page:"+cran.page2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+cran.side2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+cran.line2;
		var res=parseVolPage(result[4][0]);
		var imageN=showImage(res,to);
		document.getElementById("LineN").innerHTML="volpage:"+res.vol+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;page:"+res.page+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+res.side+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+res.line;
		document.getElementById("PicN").innerHTML=imageN;
	}
	if(to.rcode == "H"){//hPedurma
		document.getElementById("toH").innerHTML="Lhasa";
		document.getElementById("JingH").innerHTML=result[2];
		var cran=parseVolPageRange(result[3][0]);
		//document.getElementById("RangeH").innerHTML="volpage:"+cran.vol+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;page:"+cran.page+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+cran.side+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+cran.line+" ~ page:"+cran.page2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+cran.side2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+cran.line2;
		var res=parseVolPage(result[4][0]);
		var imageH=showImage(res,to);
		document.getElementById("LineH").innerHTML="volpage:"+res.vol+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;page:"+res.page+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+res.side+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+res.line;
		document.getElementById("PicH").innerHTML=imageH;
	}
	if(to.rcode == "U"){//uPedurma
		document.getElementById("toU").innerHTML="Urga";
		document.getElementById("JingU").innerHTML=result[2];
		var cran=parseVolPageRange(result[3][0]);
		//document.getElementById("RangeU").innerHTML="volpage:"+cran.vol+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;page:"+cran.page+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+cran.side+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+cran.line+" ~ page:"+cran.page2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+cran.side2+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+cran.line2;
		var res=parseVolPage(result[4][0]);
		var imageU=showImage(res,to);
		document.getElementById("LineU").innerHTML="volpage:"+res.vol+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;page:"+res.page+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;side:"+res.side+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;line:"+res.line;
		document.getElementById("PicU").innerHTML=imageU;
	}

}

var reset=function(){
	document.getElementById("Jing").innerHTML="";
	//document.getElementById("range").innerHTML="";
	document.getElementById("name").innerHTML="";
	document.getElementById("nameCh").innerHTML="";
	document.getElementById("from").innerHTML="";
	document.getElementById("toJ").innerHTML="";
	document.getElementById("toD").innerHTML="";
	document.getElementById("toC").innerHTML="";
	document.getElementById("toK").innerHTML="";
	document.getElementById("toN").innerHTML="";
	document.getElementById("toH").innerHTML="";
	document.getElementById("toU").innerHTML="";
	//document.getElementById("RangeJ").innerHTML="";
	document.getElementById("Pic").innerHTML="";
	document.getElementById("PicJ").innerHTML="";	
	document.getElementById("JingJ").innerHTML="";	
	//document.getElementById("RangeD").innerHTML="";
	document.getElementById("PicD").innerHTML="";	
	document.getElementById("JingD").innerHTML="";	
	//document.getElementById("RangeC").innerHTML="";
	document.getElementById("PicC").innerHTML="";	
	document.getElementById("JingC").innerHTML="";	
	//document.getElementById("RangeK").innerHTML="";
	document.getElementById("PicK").innerHTML="";	
	document.getElementById("JingK").innerHTML="";	
	//document.getElementById("RangeN").innerHTML="";
	document.getElementById("PicN").innerHTML="";	
	document.getElementById("JingN").innerHTML="";	
	//document.getElementById("RangeU").innerHTML="";
	document.getElementById("PicU").innerHTML="";	
	document.getElementById("JingU").innerHTML="";	
	//document.getElementById("RangeH").innerHTML="";
	document.getElementById("PicH").innerHTML="";	
	document.getElementById("JingH").innerHTML="";
	document.getElementById("LineJ").innerHTML="";
	document.getElementById("LineD").innerHTML="";
	document.getElementById("LineC").innerHTML="";
	document.getElementById("LineK").innerHTML="";
	document.getElementById("LineN").innerHTML="";
	document.getElementById("LineU").innerHTML="";
	document.getElementById("LineH").innerHTML="";

	//document.getElementById("warning").innerHTML="";
}
