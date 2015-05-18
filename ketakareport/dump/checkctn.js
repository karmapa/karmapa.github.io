var fs = require("fs");
var glob = require("glob");


var checkCtn = function(fn){
	var segs = JSON.parse(fs.readFileSync(fn,"utf8"));
	var lastPb = segs[0][0];
	for(var i=1; i<segs.length; i++){
		var correctPb = "";
		if( lastPb.substr(lastPb.length-1) === "a" ) {
			correctPb = lastPb.replace("a","b");
		} else {
			var vol = lastPb.split(".")[0];
			var page = parseInt( lastPb.split(".")[1].replace(/[ab]/,"") ) + 1;
			correctPb = vol + "." + page + "a";
		}

		if(correctPb !== segs[i][0]) console.log("error!", lastPb, segs[i][0], fn);

		lastPb = segs[i][0];
	}
}



glob("./bampo*_s.json",function(err,files){
	files.map(checkCtn);
})