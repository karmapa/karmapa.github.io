var newEntry=function(){
	var n=drawtable("new");
	var newtable="<button onClick='addRow()'>Add Row</button>"+"<button onClick='delRow()'>Delete Row</button>"
				+"<button onClick='save_edit()'>Save</button>"+"<button onClick='cancel()'>Cancel</button>"
				+"<span id='termtitle'>Entry name:<span style='font-size:large' id='showentry' contenteditable='true'>New Entry</span> "
				+"Page:<span id='showpage' contenteditable='true'>New Entry page</span>"+"</span>"+"<div>"
				+n.replace(/<td>/g,"<td contenteditable='true'>").replace(/details/,"edited_details")+"</div>";
	document.getElementById("display2").innerHTML=newtable;
	addRow();
	setLocation("clear");
}

var showentry=function(term){
	var str = JSON.stringify(term[0],"","");
	return "<li onClick='showdetails("+str+","+term[1]+")'>"+term[0].entry+"<p>"+term[0].page+"</p></li>";
}

var doentrySearch=function(tofind){
	if(tofind){
	var arr=entrySearch(tofind);
	document.getElementById("display1").innerHTML=arr.map(showentry).join("<br/>");
	}
}


var doabbSearch=function(tofind){
	if(tofind){
		var arr=abbSearch(tofind);
		document.getElementById("display1").innerHTML=arr.map(showentry).join("<br/>");
	}	
}

var showdetails=function(tofind,i){
	setLocation(i);
	document.getElementById("display2").innerHTML=drawtable(tofind);
}

var drawtable = function(obj){

    var tablestart = "<table id = 'details'>";
    var thstart = "<th>";
    var thend = "</th>";
    var tableend = "</table>";
    var tdstart = "<td>";
    var tdend = "</td>";
    var data = "";//non-breaking-space (讓td tag有東西，但顯示出的是空格;td tag沒東西的話，格子會不存在，排版會亂掉)
    var tablehead = "<tr>" + thstart + "藏文解釋" + thend 
    					   + thstart + "中文解釋" + thend + thstart + "略語1" + thend + thstart + "略語2" + thend 
    					   + thstart + "略語3" + thend + thstart + "同義詞1" + thend + thstart + "同義詞2" + thend 
    					   + thstart + "同義詞3" + thend + thstart + "出處" + thend + "</tr>";

	var tablecontent = tablestart + tablehead;

	if(obj=="new") return tablecontent+tableend;

	for (var i = 0; i < obj.tdefinitions.length; i++){
		var abb1 = obj.tdefinitions[i].cdefinitions[0].abbreviations[0];
		var abb2 = obj.tdefinitions[i].cdefinitions[0].abbreviations[1];
		var abb3 = obj.tdefinitions[i].cdefinitions[0].abbreviations[2];
		var syn1 = obj.tdefinitions[i].cdefinitions[0].synonyms[0];
		var syn2 = obj.tdefinitions[i].cdefinitions[0].synonyms[1];
		var syn3 = obj.tdefinitions[i].cdefinitions[0].synonyms[2];
		var src = obj.tdefinitions[i].cdefinitions[0].note;
		tablecontent += "<tr id='content'>" + tdstart + obj.tdefinitions[i].tdef + tdend 
							   + tdstart + obj.tdefinitions[i].cdefinitions[0].cdef + tdend + tdstart + abb1 + tdend 
							   + tdstart + abb2 + tdend + tdstart + abb3 + tdend + tdstart + syn1 + tdend 
							   + tdstart + syn2 + tdend + tdstart + syn3 + tdend + tdstart + src + tdend + "</tr>";
		for(var j = 1; j < obj.tdefinitions[i].cdefinitions.length; j++){
			var abb1 = obj.tdefinitions[i].cdefinitions[j].abbreviations[0];
			var abb2 = obj.tdefinitions[i].cdefinitions[j].abbreviations[1];
			var abb3 = obj.tdefinitions[i].cdefinitions[j].abbreviations[2];
			var syn1 = obj.tdefinitions[i].cdefinitions[j].synonyms[0];
			var syn2 = obj.tdefinitions[i].cdefinitions[j].synonyms[1];
			var syn3 = obj.tdefinitions[i].cdefinitions[j].synonyms[2];
			tablecontent += "<tr id='content'>" + tdstart + data + tdend 
								   + tdstart + obj.tdefinitions[i].cdefinitions[j].cdef + tdend + tdstart + abb1 + tdend 
								   + tdstart + abb2 + tdend + tdstart + abb3 + tdend + tdstart + syn1 + tdend 
								   + tdstart + syn2 + tdend + tdstart + syn3 + tdend + tdstart + src + tdend + "</tr>";
		}
    }
    localStorage.undo ="<span id='termtitle'><span style='font-size:50px' id='showentry'>"+obj.entry+
    					"</span>"+"<span id='showpage'>"+obj.page+"</span>"+"</span>"+"<div>"+
    					"<button onClick='edit()'>Edit</button>"+ tablecontent + tableend + "</div>";
    return localStorage.undo;
}

var addRow = function(){
	var table = document.getElementById("edited_details");
	console.log(table);
    var tr = table.getElementsByTagName("tr");
    var rowlength = tr[0].getElementsByTagName("th").length;
    var newtr = table.insertRow(tr.length);
    newtr.setAttribute('id', 'content');
    for(var i = 0;i<rowlength;i++){
    	var td = newtr.insertCell(i);
    	td.setAttribute('contenteditable', 'true');
    	td.setAttribute('id', 'editable');
    }
}

var delRow = function(){
	var table = document.getElementById("edited_details");
	console.log(table);
    var trlength = table.getElementsByTagName("tr").length;
	if(trlength>1){
		document.getElementById("edited_details").deleteRow(trlength-1);
	}
}

var cancel=function(){
	document.getElementById("display2").innerHTML=localStorage.undo;
}
	
var edit=function(){
	var table=document.getElementById("details").innerHTML;
	var title=document.getElementById("termtitle").innerHTML;
	var edittable="<span id='termtitle'>"+title+"</span>"+"<button onClick='addRow()'>Add Row</button>"+
					"<button onClick='delRow()'>Delete Row</button>"+"<button onClick='save_edit()'>Save</button>"+
					"<button onClick='cancel()'>Cancel</button>"+
					"<table id='edited_details'>"+table.replace(/<td>/g,"<td contenteditable='true' id='editable'>");
	document.getElementById("display2").innerHTML=edittable;
}

var save_edit=function(){
	var table=document.getElementById("edited_details").innerHTML;
	var title=document.getElementById("termtitle").innerHTML;
	trans_obj();
	var savetable="<span id='termtitle'>"+title+"</span>"+"<div><button onClick='edit()'>Edit</button>"+"<table id='details'>"+
					table.replace(/<td contenteditable="true" id="editable">/g,"<td>")+"</div>";
	localStorage.undo=savetable;
	document.getElementById("display2").innerHTML=savetable;
	var refresh=document.getElementById("entryinput").value;
	doentrySearch(refresh);
}	