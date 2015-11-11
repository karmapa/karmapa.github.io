var entrySearch=function(tofind){
	var out=[];
	for(var i=0;i<terms.length;i++){
		if(terms[i].entry.indexOf(tofind)>-1){
			out.push([terms[i],i]);
		}
	}
	return out;
}

var abbSearch=function(tofind){
	var out=[];
	for(var i=0;i<terms.length;i++){
		for(var j=0;j<terms[i].tdefinitions.length;j++){
			for(var k=0;k<terms[i].tdefinitions[j].cdefinitions.length;k++){
				for(var l=0;l<terms[i].tdefinitions[j].cdefinitions[k].abbreviations.length;l++){
					if(terms[i].tdefinitions[j].cdefinitions[k].abbreviations[l].indexOf(tofind)>-1){
						if(out[out.length-1]!=terms[i])	out.push([terms[i],i]);
					}
				}
			}
		}
	}
	return out;
}