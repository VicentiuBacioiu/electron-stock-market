//include d3 and techan
global.d3 = require('d3');
let techan = require('../node_modules/techan/dist/techan.min');

//predefined dimensions for the chart
const dimensions = {
    top: 20,
    bottom: 30,
    right: 50,
    left: 50,
    height: 400,
    labelSize: 40
};

//main draw function, receives data, company name, width, default coordinates
let drawGraph = function (graphData, companyName, customWidth, goToX, goToY) {
    //initialize width, height and number of ticks
    var width = customWidth - dimensions.left - dimensions.right,
        height = dimensions.height - dimensions.top - dimensions.bottom,
        ticks = Math.round(width / dimensions.labelSize),
        optimalTicks = Math.ceil(graphData.length / ticks);

    //parse date function
    var parseDate = d3.timeParse("%Y-%m-%d");

    //initialize x axis
    var x = techan.scale.financetime().range([0, width]);

    //initialize y axis
    var y = d3.scaleLinear().range([height, 0]);

    //build the candlestick chart
    var candlestick = techan.plot
        .candlestick()
        .xScale(x)
        .yScale(y);

    //determine which ticks will be visible based on width
    var visibleTicks = graphData.map(el => parseDate(el.date))
        .filter((el, idx) => {
            if (idx % optimalTicks === 0) {
                return el;
            }
        });

    //build x bottom axis        
    var xAxis = d3.axisBottom(x)
        .tickValues(visibleTicks)
        .tickFormat(d3.timeFormat("%b-%d"));

    //build x top axis        
    var xTopAxis = d3.axisTop(x)
        .tickValues(visibleTicks)
        .tickFormat(d3.timeFormat("%b-%d"));

    //build y left axis        
    var yAxis = d3.axisLeft(y);

    //build y right axis        
    var yRightAxis = d3.axisRight(y);

    //annotation left        
    var ohlcAnnotation = techan.plot
        .axisannotation()
        .axis(yAxis)
        .orient("left")
        .format(d3.format(",.2f"));

    //annotation right        
    var ohlcRightAnnotation = techan.plot
        .axisannotation()
        .axis(yRightAxis)
        .orient("right")
        .translate([width, 0]);

    //time annotation bottom        
    var timeAnnotation = techan.plot
        .axisannotation()
        .axis(xAxis)
        .orient("bottom")
        .format(d3.timeFormat("%Y-%m-%d"))
        .width(65)
        .translate([0, height]);

    //time annotation top        
    var timeTopAnnotation = techan.plot
        .axisannotation()
        .axis(xTopAxis)
        .orient("top");

    //plot crosshair        
    var crosshair = techan.plot
        .crosshair()
        .xScale(x)
        .yScale(y)
        .xAnnotation([timeAnnotation, timeTopAnnotation])
        .yAnnotation([ohlcAnnotation, ohlcRightAnnotation])
        .on("enter", enter)
        .on("out", out)
        .on("move", move);
        
    //draw the SVG      
    var svg = d3
        .select("#graph")
        .append("svg")
        .attr("width", width + dimensions.left + dimensions.right)
        .attr("height", height + dimensions.top + dimensions.bottom)
        .append("g")
        .attr("transform", "translate(" + dimensions.left + "," + dimensions.top + ")");

    //draw the text      
    var coordsText = svg
        .append("text")
        .style("text-anchor", "end")
        .attr("class", "coords")
        .attr("x", width - 5)
        .attr("y", 15);

    //setup data      
    var accessor = candlestick.accessor();
    var data = graphData
        .map(function (d) {
            return {
                date: parseDate(d.date),
                open: +d.open,
                high: +d.high,
                low: +d.low,
                close: +d.close,
                volume: +d.volume
            };
        })
        .sort(function (a, b) {
            return d3.ascending(accessor.d(a), accessor.d(b));
        });

    //map data to x/y
    x.domain(data.map(accessor.d));
    y.domain(techan.scale.plot.ohlc(data, accessor).domain());

    //append candlestick      
    svg
        .append("g")
        .datum(data)
        .attr("class", "candlestick")
        .call(candlestick);

    //append x top axis      
    svg
        .append("g")
        .attr("class", "x axis")
        .call(xTopAxis);

    //append x bottom axis      
    svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    //append y left axis      
    svg
        .append("g")
        .attr("class", "y axis")
        .call(yAxis);

    //append y right axis      
    svg
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yRightAxis);

    //move function      
    svg
        .append("g")
        .attr("class", "crosshair")
        .datum({ x: x.domain()[goToX], y: goToY })
        .call(crosshair)
        .each(move); // Display the current data

    //append text      
    svg
        .append("text")
        .attr("x", 5)
        .attr("y", 15)
        .text(companyName);

    //mouse enter trigger for crosshair      
    function enter() {
        coordsText.style("display", "inline");
    }

    //mouse out trigger for crosshair      
    function out() {
        coordsText.style("display", "none");
    }

    //mouse move trigger for crosshair      
    function move(coords) {
        coordsText.text(
            timeAnnotation.format()(coords.x) +
            ", " +
            ohlcAnnotation.format()(coords.y)
        );
    }
}

//export draw function
module.exports = {
    drawGraph: drawGraph
};