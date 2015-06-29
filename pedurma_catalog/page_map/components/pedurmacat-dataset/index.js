//var othercomponent=Require("other"); 
//new module filename must be added to scripts section of ./component.js and export here
var dataset = {
 jPedurma: require("./jPedurma"),
 cPedurma: require("./cPedurma"),
 dPedurma: require("./dPedurma"),
 hPedurma: require("./hPedurma"),
 kPedurma: require("./kPedurma"),
 uPedurma: require("./uPedurma"),
 nPedurma: require("./nPedurma"),
 sutranames: require("./sutranames"),
 taishonames: require("./taishonames"),
 api:require("./api")
}

module.exports=dataset;