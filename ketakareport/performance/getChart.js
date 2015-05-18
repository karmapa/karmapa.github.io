var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var getChart = function(bampo){
  d3.select("svg").remove();

  var y = d3.scale.linear()
      .domain([0, 1])
      .range([height, 0]);

  var yChart = d3.scale.linear()
      .domain([0, 1])
      .range([0,height]);

  var xName = d3.scale.ordinal()
      .domain(analyze[bampo].pr.map(function(d) {return d}))
      .rangeBands([0, width], .2);

  var x0 = d3.scale.ordinal()
      .domain(d3.range(analyze[bampo].pr.length))
      .rangeBands([0, width], .2);

  var x1 = d3.scale.ordinal()
      .domain(d3.range(2))//一組有2筆資料 recall, precision
      .rangeBands([0, xName.rangeBand()]);

  var z = d3.scale.category10();

  var xAxis = d3.svg.axis()
      .scale(xName)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("svg:g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  var bar=svg.append("g").selectAll("g")
            .data(analyze[bampo].rate)
          .enter().append("g")
            .style("fill", function(d, i) { return z(i); })
            .attr("transform", function(d, i) { return "translate(" + x1(i) + ",0)"; })//x座標位置
    
  bar.selectAll("rect")
        .data(function(d) { return d; })
      .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("height", function(d){return height - y(d);})
        .attr("x", function(d, i) { return x0(i); })
        .attr("y", function(d) { return y(d); })

  bar.selectAll('text')
   .data(function(d) { return d; })
   .enter() //補上資料數值  
   .append('text')   
   .text(function(d){ return (Math.round(d*100)+'%');}) //將值寫到SVG上  
   .attr({  
    'x': function(d, i){return x0(i)+x1.rangeBand()/2},  
    //和上面相同，算出X、Y的位置  
    'y': function(d){return y(d)}, //數值放在bar 內  
    'fill': 'black', //文字填滿為白色  
    'text-anchor': 'middle', //文字置中  
    'font-size': '12px' //Fill、font-size也可以用CSS寫喔～  
  });  

  var legend = svg.selectAll(".legend")
      .data(["recall","precision"])
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)//讓色塊待在整個canvas的右上角
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d,i){return z(i)});

  legend.append("text")
      .attr("x", width -24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")//讓字乖乖排在色塊旁
      .text(function(d) { return d; });

}
