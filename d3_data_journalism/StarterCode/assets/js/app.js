// @TODO: YOUR CODE HERE!

// const { range } = require("d3");

// get width  of div container for id = scatter
let svgWidth = parseInt(d3.select("#scatter").style("width"));
//set height to 2/3 of div width
let svgHeight = svgWidth - svgWidth/3;

// set margins - can adjust as needed after rendering
let margin = 20;

//calculate chart Dimension by adjusting the margin
// let chartWidth = svgWidth - margin.left - margin.right;
// let chartHeight = svgHeight - margin.top - margin.bottom;

//add space for words
let labelArea = 120;

//add padding for text at bottom and left axis
let textPadBot = 20;
let textPadLeft = 20;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
let svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class","chart");

//set the radius for the dots on the scatter plot to call later
var dotRadius;
function setDot(){
    if (svgWidth <= 500){
        dotRadius = 5;
    }
    else {dotRadius = 8;}
}

setDot();

//Create axis labels

//==========  Bottom axis =============

//Create a group element for the bottom axis label - set the class to xText
svg.append("g").attr("class","xText")
// Assign the variable xText to make the code leaner
let xText = d3.select(".xText")

//Use the transform property to make xText show up below the x-Axis
//Nest the attribute in a function to easily change the location of the labels 
//When the width of the window changes
function xTextRefresh(){
xText.attr("transform",
  "translate(" +
    ((svgWidth - labelArea)/2 +labelArea) + "," +
    (svgHeight - margin +textPadBot) + ")"
   );
 }
 xTextRefresh();

 //1. In poverty  =====
xText.append("text")
.attr("y",-25)
.attr("data-name","poverty")
.attr("data-axis","x")
.attr("class","aText active x")
.text("In Poverty (%)");

// ============ Left Axis ===========


// set up variables to make the transform more readable
let leftTextX = margin  + textPadLeft;
let leftTextY = (svgHeight + labelArea)/2 - labelArea;

//add a second label group for the left of the Y axis in the chart
svg.append("g").attr("class","yText");

//Use yText to select the group efficiently

let yText = d3.select(".yText");



// set-up function to get to bonus steps
// Set up to make the group transform happen on  window changes
function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();


  //set up yText to add the lAcks healthcare axis
yText
  .append("text")
  .attr("y", 25)
  .attr("data-name","healthcare")
  .attr("data-axis","y")
  .attr("class","aText active y")
  .text("Lacks Healthcare (%)");

 // Import csv file using d3
 //=================================
 // The data set included with the assignment is based on 2014 ACS 1-year estimates
 // The current data set includes data on rates of income,
 // obesity, poverty, etc. by state. MOE stands for "margin of error."
 

//use d3 to import the csv using .csv method
 d3.csv("./assets/data/data.csv").then(function(data){
   //call the visualize data function 
   visualize(data);
  });

//Create visualize function
function visualize(theData){
//create local variables based on the he4adings in the .csv
      let curX ="poverty";
      let curY ="healthcare";
//Set up empty vairables so we can let 
//the min/max values in the data define our axis min/max
let xMin;
let xMax;
let yMin;
let yMax;

//Set up min and max for theData passed

function xMinMax(){
  xMin = d3.min(theData,function(d){
  return parseFloat(d[curX])*.90; 
  });
  xMax = d3.max(theData,function(d) {
    return parseFloat(d[curX])*1.10;
  });
}
function yMinMax(){
  yMin = d3.min(theData,function(d){
  return parseFloat(d[curY])*.90; 
  });
  yMax = d3.max(theData,function(d) {
    return parseFloat(d[curY])*1.10;
  });
}

//Create the scatter plot ========

// Start with min and max values for X and Y

xMinMax();
yMinMax();

//Create of scales using the min and max  values

let xScale = d3.scaleLinear()
  .domain([xMin,xMax])
  .range([margin + labelArea,svgWidth-margin]);
let yScale = d3.scaleLinear()
  .domain([yMin,yMax])
  .range([svgHeight-margin - labelArea, margin]);  

//pass the scales to the axis methods to create axis
let xAxis = d3.axisBottom(xScale);
let yAxis = d3.axisLeft(yScale);
 

// append the axes to the group element
// When called we will get all of the numbers, ticks and borders
//The transform attribute tells the program where to place the axes

svg.append("g")
.call(xAxis)
.attr("class","xAxis")
.attr("transform","translate(0,"+ (svgHeight - margin - labelArea) + ")");
svg.append("g")
.call(yAxis)
.attr("class","yAxis")
.attr("transform","translate("+ (margin + labelArea) + ",0)");

//Create a group for the dots and the dot labels
let myCircles = svg.selectAll("g myCircles").data(theData).enter();

//append the circles for each row of data found in the csv
myCircles.append("circle")
  .attr("cx",function(d){
    return xScale(d[curX]);
  })
  .attr("cy",function(d){
    return yScale(d[curY]);
  })
  .attr('r',dotRadius)
  .attr("class",function(d){
    return "stateCircle " +d.abbr;
  })
  }