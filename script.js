var width = 750;
var height = 450;
var margin = {top: 20, right: 15, bottom: 30, left: 40};
    var w = width - margin.left - margin.right;
    var h = height - margin.top - margin.bottom;
var patt = new RegExp("all");
var dataset; //the full dataset


d3.csv("data.csv", function(error, students) {
//read in the data
  if (error) return console.warn(error);
     students.forEach(function(d) {
      d.Walc = +d.Walc;
      d.absenses = +d.absenses;
  });
//dataset is the full dataset -- maintain a copy of this at all times
  dataset = students;


//all the data is now loaded, so draw the initial vis
  drawVis(dataset);

});



//none of these depend on the data being loaded so fine to define here

var col = d3.scaleOrdinal(d3.schemeCategory10);


var svg = d3.select("body").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = d3.select(".chart")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom+15)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart2 = d3.select(".chart2")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom+15)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


var x = d3.scaleLinear()
        .domain([0, 5])
        .range([0, w]);

var y = d3.scaleLinear()
        .domain([0, 30])
        .range([h, 0]);

var xAxis = d3.axisBottom()
    .ticks(5)
    .scale(x);

chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
     .append("text")
      .attr("x", w)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Price");

chart2.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
     .append("text")
      .attr("x", w)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Price");

var yAxis = d3.axisLeft()
    .ticks(8)
    .scale(y);

chart.append("g")
   .attr("class", "axis")
   .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Absenses");

chart2.append("g")
   .attr("class", "axis")
   .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Self Rank of the Student's Weekend Drinkings");



var x2 = d3.scaleLinear()
    .domain([0, 5])
    .rangeRound([0, width]);

var y2 = d3.scaleLinear()
    .range([height, 0]);

var histogram = d3.histogram()
    .value(function(d) { return d.Walc; })
    .domain(x2.domain())
    .thresholds(x2.ticks(5));

chart2.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x2));

d3.csv("data.csv", function(error, data) {
  if (error) throw error;

  var bins = histogram(data);

  y.domain([0, d3.max(bins, function(d) { return d.length; })]);

  var bar = chart2.selectAll(".bar")
      .data(bins)
      .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(" + x2(d.x0) + "," + y2(d.length) + ")"; });

  bar.append("rect")
      .attr("x", 1)
      .attr("width", function(d) { return x2(d.x1) - x2(d.x0) - 1; })
      .attr("height", function(d) { return h - y2(d.length); });
});



function drawVis(dataset) { //draw the circiles initially and on each interaction with a control

  var circle = chart.selectAll("circle")
     .data(dataset);

  circle
        .attr("cx", function(d) { return x(d.Walc);  })
        .attr("cy", function(d) { return y(d.absenses);  })
        .style("fill", function(d) { return col(d.Mjob); });

  circle.exit().remove();

  circle.enter().append("circle")
        .attr("cx", function(d) { return x(d.Walc);  })
        .attr("cy", function(d) { return y(d.absenses);  })
        .attr("r", 4)
        .style("stroke", "black")
     //.style("fill", function(d) { return colLightness(d.vol); })
         .style("fill", function(d) { return col(d.Mjob); })
         .style("opacity", 0.5);
}

function filterType(mytype) {
  var res = patt.test(mytype); 
  if(res){ 
    drawVis(dataset); 
  }else{
    var ndata = dataset.filter(function(d) { 
      return d['Mjob'] == mytype;
  }); 
    drawVis(ndata); 
  }
}

function filterAge(values){ 
  var toVisualize = dataset.filter(function(d) {
    return d['age'] >= values[0]  && d['age'] < values[1] 
  }); 
  drawVis(toVisualize); 
}


