/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */
var searchbar=Require("searchbar"); 
var fromsutra=Require("fromsutra"); 
var corressutras=Require("corressutras"); 
var dataset=Require("dataset"); //{dataset.hPedurma};
var api=Require("dataset").api;
var sutraimage=Require("sutraimage");
var longnames={"J":"Lijiang","D":"Derge","C":"Cone","K":"Pedurma","N":"Narthang","H":"Lhasa","U":"Urga"};
var mappings={"J":dataset.jPedurma,"D":dataset.dPedurma,"C":dataset.cPedurma,"K":dataset.kPedurma,"N":dataset.nPedurma,"H":dataset.hPedurma,"U":dataset.uPedurma};

var main = React.createClass({
  getInitialState: function() {
    return {corres:[],res:[]};
  },
  search: function(volpage,from){
    var out=[];
    for(var to in mappings){
      if(mappings[from].rcode != mappings[to].rcode){
        var res = api.dosearch(volpage,mappings[from],mappings[to]);
        //res = [版本縮寫,[[經號],[範圍],[對照經號],[對照範圍],[對照行],[K經號]]]
        out.push({
          toRecen:longnames[to],
          toJing:res[1][0][0],
          corresLine:res[1][4][0]
        });
      }     
    }
    this.setState({volpage:volpage, fromRecen:longnames[from], KJing:res[1][5][0], fromJing:res[1][0][0], corres:out });   
  },
  parseVolPage: function(str){
    str=str || "";
    var s=str.match(/(\d+)[@.](\d+)([abcd]*)(\d*)/);
    //var s=str.match(/(\d+)[@.](\d+)([abcd])(\d*)-*(\d*)([abcd]*)(\d*)/);
    if(!s){
      console.log("error!",str);
      return null;
    }
    return {vol:parseInt(s[1]),page:parseInt(s[2]),side:s[3] || "x",line:parseInt(s[4]||"1")};
    //return {vol:parseInt(s[1]),page:parseInt(s[2]),side:s[3],line:parseInt(s[4]||"1"),page2:parseInt(s[5]),side2:s[6],line2:parseInt(s[7]||"1")};
  },
  render: function() {
    return (
      <div>
        <searchbar search={this.search} />        
        <fromsutra volpage={this.state.volpage} fromRecen={this.state.fromRecen} KJing={this.state.KJing} parseVolPage={this.parseVolPage} fromJing={this.state.fromJing} />
        <corressutras corres={this.state.corres} parseVolPage={this.parseVolPage} />
      </div>
    );
  }
});
module.exports=main;