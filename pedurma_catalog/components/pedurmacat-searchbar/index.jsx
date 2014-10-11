/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var searchbar = React.createClass({
  getInitialState: function() {
    return {recen:""};
  },
  search: function() {
    var volpage=this.refs.volpage.getDOMNode().value;
    {this.props.search(volpage,this.state.recen)};
  },
  getRecen: function(e) {
    var recen=e.target.value;
    this.setState({recen:recen});
  },
  render: function() {
    return(
      <div className="row col-lg-offset-4">
        <div className="col-lg-2">  
          <select onChange={this.getRecen} className="form-control">
            <option value="D">Derge</option>
            <option value="J">Lijiang</option>     
            <option value="C">Cone</option>
            <option value="N">Narthang</option>
            <option value="H">Lhasa</option>
            <option value="U">Urga</option>
          </select>
        </div>      
        <div className="col-lg-3">
          <input className="form-control" type="text" ref="volpage" defaultValue="4.12a2"/>
        </div>
        <button className="btn btn-success" onClick={this.search} >Search</button>
      </div>
    ); 
  }
});
module.exports=searchbar;