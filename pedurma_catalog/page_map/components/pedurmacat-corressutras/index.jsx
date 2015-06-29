/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var sutraimage=Require("sutraimage");
var corressutras = React.createClass({
  getInitialState: function() {
    return {};
  },
  snap2realpage: function(id){
    if(id.side == "c"){
      id.side=id.side.replace("c","b");
    }
    else if(id.side == "d"){
      id.page=id.page+1;
      id.side="a";
    }
    return id;
  },
  renderItem: function(item) {
    var c=this.props.parseVolPage(item.corresLine);
    var corresLine=this.snap2realpage(c);
    return(
      <div>
        <span className="recen">{item.toRecen}</span>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Sutra: {item.toJing}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Volume: {corresLine.vol}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Page: {corresLine.page}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Side: {corresLine.side}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Line: {corresLine.line}
        <sutraimage volpage={corresLine} recen={item.toRecen} parseVolPage={this.props.parseVolPage} />
      </div>
    );
  },
  render: function() {

    return (
      <div>
        {this.props.corres.map(this.renderItem)}
      </div>
    );
  }
});
module.exports=corressutras;