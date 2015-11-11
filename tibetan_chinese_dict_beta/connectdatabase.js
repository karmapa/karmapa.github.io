var terms;
var db = new Firebase('https://treasuredict.firebaseio.com/');
db.on("value", function(snapshot) {
	terms=snapshot.val();  
}, function (errorObject) {
	console.log("The read failed: " + errorObject.code);
});

var saveEdited=function(obj,p){
	db.child(p).set(obj);
	terms[p]=obj;
}

var saveNewEntry=function(obj,p){
	console.log(obj,p);
	var entry={};
	entry[p]=obj;
	db.update(entry);
	terms[p]=obj;
}