global.d3 = require('d3');
let techan = require('../node_modules/techan/dist/techan.min');
const dimensions = {
    top: 20,
    bottom: 30,
    right: 50,
    left: 50,
    height: 400,
    labelSize: 40
};

let drawGraph = function (graphData, companyName, customWidth, goToX, goToY) {
    var width = customWidth - dimensions.left - dimensions.right,
        height = dimensions.height - dimensions.top - dimensions.bottom,
        ticks = Math.round(width / dimensions.labelSize),
        optimalTicks = Math.ceil(graphData.length / ticks);

    var parseDate = d3.timeParse("%Y-%m-%d");

    var x = techan.scale.financetime().range([0, width]);

    var y = d3.scaleLinear().range([height, 0]);

    var candlestick = techan.plot
        .candlestick()
        .xScale(x)
        .yScale(y);

    var visibleTicks = graphData.map(el => parseDate(el.date))
        .filter((el, idx) => {
            if (idx % optimalTicks === 0) {
                return el;
            }
        });

    var xAxis = d3.axisBottom(x)
        .tickValues(visibleTicks)
        .tickFormat(d3.timeFormat("%b-%d"));

    var xTopAxis = d3.axisTop(x)
        .tickValues(visibleTicks)
        .tickFormat(d3.timeFormat("%b-%d"));

    var yAxis = d3.axisLeft(y);

    var yRightAxis = d3.axisRight(y);

    var ohlcAnnotation = techan.plot
        .axisannotation()
        .axis(yAxis)
        .orient("left")
        .format(d3.format(",.2f"));

    var ohlcRightAnnotation = techan.plot
        .axisannotation()
        .axis(yRightAxis)
        .orient("right")
        .translate([width, 0]);

    var timeAnnotation = techan.plot
        .axisannotation()
        .axis(xAxis)
        .orient("bottom")
        .format(d3.timeFormat("%Y-%m-%d"))
        .width(65)
        .translate([0, height]);

    var timeTopAnnotation = techan.plot
        .axisannotation()
        .axis(xTopAxis)
        .orient("top");

    var crosshair = techan.plot
        .crosshair()
        .xScale(x)
        .yScale(y)
        .xAnnotation([timeAnnotation, timeTopAnnotation])
        .yAnnotation([ohlcAnnotation, ohlcRightAnnotation])
        .on("enter", enter)
        .on("out", out)
        .on("move", move);

    var svg = d3
        .select("#graph")
        .append("svg")
        .attr("width", width + dimensions.left + dimensions.right)
        .attr("height", height + dimensions.top + dimensions.bottom)
        .append("g")
        .attr("transform", "translate(" + dimensions.left + "," + dimensions.top + ")");

    var coordsText = svg
        .append("text")
        .style("text-anchor", "end")
        .attr("class", "coords")
        .attr("x", width - 5)
        .attr("y", 15);

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

    x.domain(data.map(accessor.d));
    y.domain(techan.scale.plot.ohlc(data, accessor).domain());

    svg
        .append("g")
        .datum(data)
        .attr("class", "candlestick")
        .call(candlestick);

    svg
        .append("g")
        .attr("class", "x axis")
        .call(xTopAxis);

    svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg
        .append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yRightAxis);

    svg
        .append("g")
        .attr("class", "crosshair")
        .datum({ x: x.domain()[goToX], y: goToY })
        .call(crosshair)
        .each(move); // Display the current data

    svg
        .append("text")
        .attr("x", 5)
        .attr("y", 15)
        .text(companyName);

    function enter() {
        coordsText.style("display", "inline");
    }

    function out() {
        coordsText.style("display", "none");
    }

    function move(coords) {
        coordsText.text(
            timeAnnotation.format()(coords.x) +
            ", " +
            ohlcAnnotation.format()(coords.y)
        );
    }
}

module.exports = {
    drawGraph: drawGraph
};