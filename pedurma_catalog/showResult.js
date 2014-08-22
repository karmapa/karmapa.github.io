var showResult_Jing=function(volpage,result){//result=[自己範圍,對照經號,對照範圍]
	document.getElementById("Jing").innerHTML=volpage;
	document.getElementById("corresJing").innerHTML=result[0][1];
	var ran=parseVolPageRange(result[0][0]);
	document.getElementById("range").innerHTML="volpage:"+ran.vol+", page:"+ran.page+", side:"+ran.side+", line:"+ran.line+" ~ page:"+ran.page2+", side:"+ran.side2+", line:"+ran.line2;
	var cran=parseVolPageRange(result[0][2]);
	document.getElementById("corresRange").innerHTML="volpage:"+cran.vol+", page:"+cran.page+", side:"+cran.side+", line:"+cran.line+" ~ page:"+cran.page2+", side:"+cran.side2+", line:"+cran.line2;
	// document.getElementById("corresLine").innerHTML="";

}

var showResult_Volpage_from=function(result){
	document.getElementById("Jing").innerHTML=result[0][0];
	var ran=parseVolPageRange(result[1][0]);
	document.getElementById("range").innerHTML="volpage:"+ran.vol+", page:"+ran.page+", side:"+ran.side+", line:"+ran.line+" ~ page:"+ran.page2+", side:"+ran.side2+", line:"+ran.line2;
}

var showResult_Volpage=function(result,to){//result=[經號],[範圍],[對照經號],[對照範圍],[對照行]

	if(to.length == 1131){//jPedurma
		document.getElementById("toJ").innerHTML="Lijiang";
		document.getElementById("JingJ").innerHTML=result[2];
		var cran=parseVolPageRange(result[3][0]);
		document.getElementById("RangeJ").innerHTML="volpage:"+cran.vol+", page:"+cran.page+", side:"+cran.side+", line:"+cran.line+" ~ page:"+cran.page2+", side:"+cran.side2+", line:"+cran.line2;
		var res=parseVolPage(result[4][0]);
		document.getElementById("LineJ").innerHTML="volpage:"+res.vol+", page:"+res.page+", side:"+res.side+", line:"+res.line;
	}
	if(to.length == 1138){//dPedurma
		document.getElementById("toD").innerHTML="Derge";
		document.getElementById("JingD").innerHTML=result[2];
		var cran=parseVolPageRange(result[3][0]);
		document.getElementById("RangeD").innerHTML="volpage:"+cran.vol+", page:"+cran.page+", side:"+cran.side+", line:"+cran.line+" ~ page:"+cran.page2+", side:"+cran.side2+", line:"+cran.line2;
		var res=parseVolPage(result[4][0]);
		document.getElementById("LineD").innerHTML="volpage:"+res.vol+", page:"+res.page+", side:"+res.side+", line:"+res.line;
	}
	if(to.length == 1116){//cPedurma
		document.getElementById("toC").innerHTML="Cone";
		document.getElementById("JingC").innerHTML=result[2];
		var cran=parseVolPageRange(result[3][0]);
		document.getElementById("RangeC").innerHTML="volpage:"+cran.vol+", page:"+cran.page+", side:"+cran.side+", line:"+cran.line+" ~ page:"+cran.page2+", side:"+cran.side2+", line:"+cran.line2;
		var res=parseVolPage(result[4][0]);
		document.getElementById("LineC").innerHTML="volpage:"+res.vol+", page:"+res.page+", side:"+res.side+", line:"+res.line;
	}
	if(to.length == 1203){//kPedurma
		document.getElementById("toK").innerHTML="CK";
		document.getElementById("JingK").innerHTML=result[2];
		var cran=parseVolPageRange(result[3][0]);
		document.getElementById("RangeK").innerHTML="volpage:"+cran.vol+", page:"+cran.page+", side:"+cran.side+", line:"+cran.line+" ~ page:"+cran.page2+", side:"+cran.side2+", line:"+cran.line2;
		var res=parseVolPage(result[4][0]);
		document.getElementById("LineK").innerHTML="volpage:"+res.vol+", page:"+res.page+", side:"+res.side+", line:"+res.line;
	}
	if(to.length == 798){//nPedurma
		document.getElementById("toN").innerHTML="Narthang";
		document.getElementById("JingN").innerHTML=result[2];
		var cran=parseVolPageRange(result[3][0]);
		document.getElementById("RangeN").innerHTML="volpage:"+cran.vol+", page:"+cran.page+", side:"+cran.side+", line:"+cran.line+" ~ page:"+cran.page2+", side:"+cran.side2+", line:"+cran.line2;
		var res=parseVolPage(result[4][0]);
		document.getElementById("LineN").innerHTML="volpage:"+res.vol+", page:"+res.page+", side:"+res.side+", line:"+res.line;
	}
	if(to.length == 837){//hPedurma
		document.getElementById("toH").innerHTML="Lhasa";
		document.getElementById("JingH").innerHTML=result[2];
		var cran=parseVolPageRange(result[3][0]);
		document.getElementById("RangeH").innerHTML="volpage:"+cran.vol+", page:"+cran.page+", side:"+cran.side+", line:"+cran.line+" ~ page:"+cran.page2+", side:"+cran.side2+", line:"+cran.line2;
		var res=parseVolPage(result[4][0]);
		document.getElementById("LineH").innerHTML="volpage:"+res.vol+", page:"+res.page+", side:"+res.side+", line:"+res.line;
	}
	if(to.length == 1125){//uPedurma
		document.getElementById("toU").innerHTML="Urga";
		document.getElementById("JingU").innerHTML=result[2];
		var cran=parseVolPageRange(result[3][0]);
		document.getElementById("RangeU").innerHTML="volpage:"+cran.vol+", page:"+cran.page+", side:"+cran.side+", line:"+cran.line+" ~ page:"+cran.page2+", side:"+cran.side2+", line:"+cran.line2;
		var res=parseVolPage(result[4][0]);
		document.getElementById("LineU").innerHTML="volpage:"+res.vol+", page:"+res.page+", side:"+res.side+", line:"+res.line;
	}

}

var reset=function(){
	document.getElementById("Jing").innerHTML="";
	document.getElementById("range").innerHTML="";
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
	document.getElementById("RangeJ").innerHTML="";
	document.getElementById("LineJ").innerHTML="";	
	document.getElementById("JingJ").innerHTML="";	
	document.getElementById("RangeD").innerHTML="";
	document.getElementById("LineD").innerHTML="";	
	document.getElementById("JingD").innerHTML="";	
	document.getElementById("RangeC").innerHTML="";
	document.getElementById("LineC").innerHTML="";	
	document.getElementById("JingC").innerHTML="";	
	document.getElementById("RangeK").innerHTML="";
	document.getElementById("LineK").innerHTML="";	
	document.getElementById("JingK").innerHTML="";	
	document.getElementById("RangeN").innerHTML="";
	document.getElementById("LineN").innerHTML="";	
	document.getElementById("JingN").innerHTML="";	
	document.getElementById("RangeU").innerHTML="";
	document.getElementById("LineU").innerHTML="";	
	document.getElementById("JingU").innerHTML="";	
	document.getElementById("RangeH").innerHTML="";
	document.getElementById("LineH").innerHTML="";	
	document.getElementById("JingH").innerHTML="";	
	//document.getElementById("warning").innerHTML="";
}
