//Declare various variables for the scatterplot
var width1 = 750;
var height1 = 450;
var margin1 = {top: 20, right: 15, bottom: 30, left: 40};
var w = width1 - margin1.left - margin1.right;
var h = height1 - margin1.top - margin1.bottom;
var patt = new RegExp("all");
var dataset; //the full dataset

//Declare variables that will help later on with filtering
var attributes = ["spending", "workerusa", "year"];
var maxSpending = 15000;
var maxWorker = 15000;
var maxYear = 2016;
var ranges = [[0, maxSpending], [0, maxWorker], [0, maxYear]]
var months = [["all", true], ["Jan", false], ["Feb", false], 
["Mar", false], ["Apr", false], ["May", false], ["Jun", false], 
["Jul", false], ["Aug", false], ["Sep", false], ["Oct", false], 
["Nov", false], ["Dec", false]];
var chosenMonths = months;

//Read in the csv data
d3.csv("data.csv", function(error, students) {
  if (error) return console.warn(error);
     students.forEach(function(d) {
      d.spending = +d.spending;
      d.workerusa = +d.workerusa;
      d.year = +d.year;
  });

  //Save a copy of the full dataset
  dataset = students;
  toVisualize = dataset;

  //Draw initial visualization
  drawVis(dataset);

});

//Save for when I have more ordinal data
var col = d3.scaleOrdinal()
      .domain(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
      .range(["#800000", "#FF0000" , "#800080", "#FF00FF", "#008000", "#00FF00", "#808000", "#FFFF00", "#000080", "#0000FF", "#008080", "#00FFFF"]);
//Initialize scatterplot

var chart1 = d3.select(".chart1")
    .attr("width", w + margin1.left + margin1.right)
    .attr("height", h + margin1.top + margin1.bottom+15)
    .append("g")
    .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0); 

//Scale scatterplot axes 
var x1 = d3.scaleLinear()
        .domain([0, 15000])
        .range([0, w]);

var y1 = d3.scaleLinear()
        .domain([0, 15000])
        .range([h, 0]);

var xAxis1 = d3.axisBottom()
    .ticks(5)
    .scale(x1);

//Add x Axis to the scatterplot
chart1.append("g")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis1);

chart1.append("text")
  .attr("transform",
            "translate(" + (width1/2) + " ," + 
                           (h + margin1.top + 15) + ")")
      .style("text-anchor", "middle")
      .text("Amount of Alcohol Sold (in Millions of Dollars)");

//Add y Axis to the scatterplot
var yAxis1 = d3.axisLeft()
    .ticks(8)
    .scale(y1);

chart1.append("g")
   .attr("class", "yaxis")
   .call(yAxis1);

 chart1.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin1.left - 5)
      .attr("x",0 - (height1 / 2) + 20)
      .attr("dy", "0em")
      .style("text-anchor", "middle")
      .attr("class", "axistitle")
      .text("Number of Workers in Drinking Establishments (in Thousands of People)");       



//Draw circles for the scatterplot
function drawVis(dataset) { //draw the circiles initially and on each interaction with a control

  var circle = chart1.selectAll("circle")
     .data(dataset);
  
  circle
        .attr("cx", function(d) { return x1(d.workerusa);  })
        .attr("cy", function(d) { return y1(d.spending);  })
        .style("fill", function(d) { return col(d.month); });

  circle.exit().remove();

  //Add circle to the scatterplot
  circle.enter().append("circle")
        .attr("cx", function(d) { return x1(d.workerusa);  })
        .attr("cy", function(d) { return y1(d.spending);  })
        .attr("r", 4)
        .style("stroke", "black")
        //.style("fill", function(d) { return colLightness(d.month); })
         .style("fill", function(d) { return col(d.month); })
         .style("opacity", 0.6)
         .on("mouseover", function(d) {
            d3.select(this).attr("r", 7);
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("<b>" + d.date + "</b><br /><br /> <u>Amount Spent</u>:<br />$" + d.spending
                          + " Million<br /><br /> <u>Number of Workers</u>:<br />" + d.workerusa + " Thousand")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("r", 4);
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}

//Filter based on the months chosen by the user
function filterMonth(mytype) {
  //If the user chooses all months, uncheck any other months and filter on that
  if(mytype == "all"){ 
    chosenMonths[0][1] = true;
    for (i = 1; i < chosenMonths.length; i++) {
        chosenMonths[i][1] = false;
    }
    document.getElementById("Jan").checked = false;
    document.getElementById("Feb").checked = false;
    document.getElementById("Mar").checked = false;
    document.getElementById("Apr").checked = false;
    document.getElementById("May").checked = false;
    document.getElementById("Jun").checked = false;
    document.getElementById("Jul").checked = false;
    document.getElementById("Aug").checked = false;
    document.getElementById("Sep").checked = false;
    document.getElementById("Oct").checked = false;
    document.getElementById("Nov").checked = false;
    document.getElementById("Dec").checked = false;
    var toVisualize = dataset.filter(function(d) { return inRange(d)});
    drawVis(toVisualize);
  }else{
    //Filter based on chosen months and redraw the visualization
    document.getElementById("all").checked = false;
    chosenMonths[0][1] = false;
        for (i = 1; i < chosenMonths.length; i++) {
            if (chosenMonths[i][0] == mytype) {
                if (chosenMonths[i][1]) {
                    chosenMonths[i][1] = false;
                    document.getElementById(mytype).checked = false;

                } else {
                    chosenMonths[i][1] = true;
                    document.getElementById(mytype).checked = true;
                }
            }
        } 
        // filter based on currTypes
        var ndata = filterChosenMonths(dataset);

        // filter to account for sliders and drawVis
        ndata = ndata.filter(function(d) { return inRange(d)});
        drawVis(ndata);
  }
}

//Update the array of chosen months
function filterChosenMonths(data) {
    var newData = [];
    for (i = 0; i < chosenMonths.length; i++) {
        if (chosenMonths[i][1]) {
            newData = newData.concat(data.filter(function(d) {
                return d['month'] == chosenMonths[i][0];
            }));
        }
    }
    return newData;
}

//Setting up the slider for year filtering
$(function() {
    $("#year").slider({
        range: true,
        min: 1990,
        max: maxYear,
        values: [ 1990, maxYear ],

        slide: function(event, ui ) {
            $("#yearvalue").val(ui.values[0] + " - " + ui.values[1]); filterSliders("year", ui.values);
        } 
    });

    $("#yearvalue").val($("#year").slider("values", 0) + " - " + $("#year").slider("values", 1));
});

/* Tried to implement a rescale axis
function rescale() {
            y1.domain([0,])  // change scale to 0, to between 100 more than max y value
            vis.select(".yaxis")
                    .transition().duration(1500).ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
                    .call(yAxis1);
        } 
*/

//Filter based on the years chosen on the slider
function filterSliders(attr, values) {
    for (i = 0; i < attributes.length; i++){
        if (attr == attributes[i]){
            ranges[i] = values;
        }
    }
    var toVisualize = dataset.filter(function(d) { return inRange(d)});
    if (!chosenMonths[0][1]) {
        toVisualize = filterChosenMonths(toVisualize);
    }
    drawVis(toVisualize);
}

//Checks to make sure that all the quantitative values are in the range of the dataset
function inRange(datum) {
    for (i = 0; i < attributes.length; i++) {
        if (datum[attributes[i]] < ranges[i][0] || datum[attributes[i]] > ranges[i][1]) {
            return false;
        }
    }
    return true;
}


//Initialize the second chart, an area graph
var svg2 = d3.select(".chart2"),
margin = {top: 20, right: 20, bottom: 110, left: 40},
margin2 = {top: 430, right: 20, bottom: 30, left: 40},
width = +svg2.attr("width") - margin.left - margin.right,
height = +svg2.attr("height") - margin.top - margin.bottom,
height2 = +svg2.attr("height") - margin2.top - margin2.bottom;

//Later will help read the dates in the dataset
var parseDate = d3.timeParse("%b %Y");

//Scale the axes
var x2 = d3.scaleTime().range([0, width]),
x3 = d3.scaleTime().range([0, width]),
y2 = d3.scaleLinear().range([height, 0]),
y3 = d3.scaleLinear().range([height2, 0]);

var xAxis2 = d3.axisBottom(x2),
xAxis3 = d3.axisBottom(x3),
yAxis2 = d3.axisLeft(y2).ticks(8);

//Brush feature
var brush = d3.brushX()
.extent([[0, 0], [width, height2]])
.on("brush end", brushed);

//Zoom feature
var zoom = d3.zoom()
.scaleExtent([1, Infinity])
.translateExtent([[0, 0], [width, height]])
.extent([[0, 0], [width, height]])
.on("zoom", zoomed);

//Line for the bigger graph
var valueline = d3.line()
    .x(function(d) { return x2(d.date); })
    .y(function(d) { return y2(d.spending); });

//Line for smaller graph
var valueline2 = d3.line()
    .x(function(d) { return x3(d.date); })
    .y(function(d) { return y3(d.spending); });

svg2.append("defs").append("clipPath")
.attr("id", "clip")
.append("rect")
.attr("width", width)
.attr("height", height);

//Big graph
var focus = svg2.append("g")
.attr("class", "focus")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Small graph
var context = svg2.append("g")
.attr("class", "context")
.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

//Read the csv data
d3.csv("data.csv", type, function(error, data) {
    if (error) throw error;
    
    x2.domain(d3.extent(data, function(d) { return d.date; }));
    y2.domain([0, d3.max(data, function(d) { return d.spending; })]);
    x3.domain(x2.domain());
    y3.domain(y2.domain());
    
    focus.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", valueline)
    .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("<b>" + d.date + "</b><br /><br /> <u>Amount Spent</u>:<br />$" + d.spending
                          + " Million<br /><br /> <u>Number of Workers</u>:<br />" + d.workerusa + " Thousand")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
    
    focus.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis2);

    focus.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 15) + ")")
      .style("text-anchor", "middle")
      .text("Date");
    
    focus.append("g")
    .attr("class", "axis axis--y")
    .call(yAxis2);

   focus.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left - 5)
      .attr("x",0 - (height / 2))
      .attr("dy", "0em")
      .style("text-anchor", "middle")
      .text("Amount of Alcohol Sold (in Millions of Dollars)");   
    
    context.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", valueline2);
    
    context.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height2 + ")")
    .call(xAxis3);
    
    context.append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.move, x2.range());
    
    svg2.append("rect")
    .attr("class", "zoom")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);
});

//After user selects area
function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;
    var s = d3.event.selection || x3.range();
    x2.domain(s.map(x2.invert, x3));
    focus.select(".line").attr("d", valueline);
    focus.select(".axis--x").call(xAxis2);
    svg2.select(".zoom").call(zoom.transform, d3.zoomIdentity
    .scale(width / (s[1] - s[0]))
    .translate(-s[0], 0));
}

//After user zooms
function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return;
    var t = d3.event.transform;
    x2.domain(t.rescaleX(x3).domain());
    focus.select(".line").attr("d", valueline);
    focus.select(".axis--x").call(xAxis2);
    context.select(".brush").call(brush.move, x2.range().map(t.invertX, t));
}

function type(d) {
    d.date = parseDate(d.date);
    d.spending = +d.spending;
    return d;
}


//Functions associated with the buttons and different views
$(function() {
  $(".scatterplot").hide();
})

$("#linebutton").click(function(){
    $(".scatterplot").hide();
    $(".linegraph").show();
});

$("#scatterbutton").click(function(){
    $(".linegraph").hide();
    $(".scatterplot").show();
});
