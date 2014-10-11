/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var sutraimage=Require("sutraimage");
var sutranames=Require("dataset").sutranames; 
var taishonames=Require("dataset").taishonames;

var fromBar = React.createClass({
  searchSutraName:function(KJing){
    for(var i=0; i<sutranames.length; i++){
      if(KJing == sutranames[i][0]) return sutranames[i][1];
      //else return "";
    } 
  },
  render: function(){
    return  (
      <div>
        <span className="recen">{this.props.fromRecen}</span>       
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Sutra: {this.props.fromJing}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Sutra Name: {this.searchSutraName(this.props.KJing)}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Taisho Name: 
      </div>
    );
  }
});

var fromsutra = React.createClass({
  getInitialState: function() {
    return {};
  }, 
  render: function() {
    var volpage=this.props.parseVolPage(this.props.volpage);
    return (
      <div>     
        <fromBar KJing={this.props.KJing} fromRecen={this.props.fromRecen} fromJing={this.props.fromJing} />
        <sutraimage volpage={volpage} recen={this.props.fromRecen} />
      </div>
    );
  }
});
module.exports=fromsutra;