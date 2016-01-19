var colors = d3.scale.category10();
var marginHorz = { top: 20, right: 20, bottom: 40, left: 120},
        widthHorz = 500 - marginHorz.left - marginHorz.right,
        heightHorz = 350 - marginHorz.top - marginHorz.bottom;
    
var xHorz = d3.scale.linear().range([0,widthHorz]);
var yHorz = d3.scale.ordinal().rangeRoundBands([0,heightHorz], .05);;

var  xAxisHorz = d3.svg.axis()
    .scale(xHorz)
    .orient("bottom")
    .ticks(10);

var yAxisHorz = d3.svg.axis()
    .scale(yHorz)
    .orient("left");

var svgHorz = d3.select("#horizontalBarChart").append("svg")
    .attr("width", widthHorz + marginHorz.left + marginHorz.right)
    .attr("height", heightHorz + marginHorz.top + marginHorz.bottom)
    .append("g")
    .attr("transform", "translate(" + marginHorz.left + "," + marginHorz.top + ")");

d3.json("data/horizontalBar.json", function (error, data) {

    data.forEach(function(d) {
        d.region = d.region;
        d.values = +d.values;
        d.targets = +d.targets;
    });

    xHorz.domain([0, d3.max(data, function(d) { return d.values; })]);
    yHorz.domain(data.map(function(d) {return d.region; }));

    svgHorz.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightHorz + ")")
        .call(xAxisHorz)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );


    svgHorz.append("g")
        .attr("class", "y axis")
        .call(yAxisHorz)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    svgHorz.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .style("fill", function (d,i){ return colors(i); })
        .attr("x", 0)
        .attr("width", function (d){
            return xHorz(d.values);
        })
        .transition()
        .duration(1000)
        .attr("y", function (d){
            return yHorz(d.region);
        })
        .attr("height", yHorz.rangeBand());

    var target = d3.svg.line()
                    .y(function (d){
                        return yHorz(d.region);
                    })
                    .x(function (d){
                        return xHorz(d.targets);
                    });
    svgHorz.append('svg:path')
            .attr('d', target(data))
            .attr("transform", "translate(0," + (marginHorz.top + 10) + ")")
            .attr("stroke", "#344")
            .attr("class"," horzBarTarget")
            .style("stroke-dasharray", ("6, 3"))
            .attr("stroke-width", 2)
            .attr("fill", "none");
});