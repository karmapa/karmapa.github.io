var fs = require("fs");
var glob = require("glob");

var sortSeg = function(fn) {
	var arr=JSON.parse(fs.readFileSync(fn,"utf8"))
	arr.sort(function(a,b) {
	var x=parseInt(a[0].substr(a[0].indexOf(".")+1).replace(/[ab]/,""));
	var y=parseInt(b[0].substr(b[0].indexOf(".")+1).replace(/[ab]/,""));
	if(x>y) return 1;
	else if(x<y) return -1;
	else if(x==y) {
	  return a[0]>b[0];
	}
	});
	json2js(arr,fn.replace(/[\.\/bampojson]/g,""));
}

var json2js = function(arr, fn){
	var out = [];
	var filename = "bampo" + fn;
	out = "var " + filename + " = \n" + JSON.stringify(arr,""," ") + "\nmodule.exports = " + filename;

	//fs.writeFileSync(filename+".js",out,"utf8");
	fs.writeFileSync(filename+"_s.json", JSON.stringify(arr,""," "),"utf8");
}

//checkContent(JSON.parse(fs.readFileSync("d0303_001.json","utf8")),"0303_001");
glob("./bampo*.json",function(err, files){
	files.map(sortSeg);
})
//sortSeg("./bampo0303_001.json");
module.exports = json2js;