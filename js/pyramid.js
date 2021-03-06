d3.json("data/pyramid.json",function (data){
  var w = 550,
    h = 300,
    topMargin = 15,
    labelSpace = 40,
    innerMargin = w/2+labelSpace,
    outerMargin = 15,
    gap = 7,
    dataRange = d3.max(data.map(function(d) { return Math.max(d.barData1, d.barData2) }));
    leftLabel = "Indicators",
    rightLabel = "Maternal Mortality";

var chartWidth = w - innerMargin - outerMargin,
    barWidth = h / data.length,
    yScale = d3.scale.linear().domain([0, data.length]).range([0, h-topMargin]),
    total = d3.scale.linear().domain([0, dataRange]).range([0, chartWidth - labelSpace]),
    commas = d3.format(",.0f");

var vis = d3.select("#vis").append("svg")
    .attr("width", w)
    .attr("height", h);

/* barData1 label */
vis.append("text")
  .attr("class", "label")
  .text(leftLabel)
  .attr("x", w-innerMargin)
  .attr("y", topMargin-3)
  .attr("text-anchor", "end");

/* barData2 label */
vis.append("text")
  .attr("class", "label")
  .text(rightLabel)
  .attr("x", innerMargin)
  .attr("y", topMargin-3);

/* female bars and data labels */ 
var bar = vis.selectAll("g.bar")
    .data(data)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d, i) {
      return "translate(0," + (yScale(i) + topMargin) + ")";
    });

var wholebar = bar.append("rect")
    .attr("width", w)
    .attr("height", barWidth-gap)
    .attr("fill", "none")
    .attr("pointer-events", "all");

var highlight = function(c) {
  return function(d, i) {
    bar.filter(function(d, j) {
      return i === j;
    }).attr("class", c);
  };
};

bar
  .on("mouseover", highlight("highlight bar"))
  .on("mouseout", highlight("bar"));

bar.append("rect")
    .attr("class", "femalebar")
    .attr("fill", function (d,i){
      return colors(i);
    })
    .attr("height", barWidth-gap);

bar.append("text")
    .attr("class", "femalebar")
    .attr("dx", -3)
    .attr("dy", "1em")
    .attr("text-anchor", "end");

bar.append("rect")
    .attr("class", "malebar")
    .attr("fill", function (d,i){
      return colors(i);
    })
    .attr("height", barWidth-gap)
    .attr("x", innerMargin);

bar.append("text")
    .attr("class", "malebar")
    .attr("dx", 3)
    .attr("dy", "1em");

/* sharedLabels */
bar.append("text")
    .attr("class", "shared")
    .attr("x", w/2)
    .attr("dy", "1em")
    .attr("text-anchor", "middle")
    .text(function(d) { return d.sharedLabel; });

d3.select("#generate").on("click", function() {
  for (var i=0; i<data.length; i++) {
    data[i].barData1 = Math.random() * dataRange;
    data[i].barData2 = Math.random() * dataRange;
  }
  refresh(data);
});

refresh(data);

function refresh(data) {
  var bars = d3.selectAll("g.bar")
      .data(data);
  bars.selectAll("rect.malebar")
    .transition()
    .ease("elastic")
    .duration(1000)
      .attr("width", function(d) { return total(d.barData1); });
  bars.selectAll("rect.femalebar")
    .transition()
    .ease("elastic")
    .duration(1000)
      .attr("x", function(d) { return innerMargin - total(d.barData2) - 2 * labelSpace; }) 
      .attr("width", function(d) { return total(d.barData2); });

  bars.selectAll("text.malebar")
      .text(function(d) { return commas(d.barData1); })
    .transition()
      .attr("x", function(d) { return innerMargin + total(d.barData1); });
  bars.selectAll("text.femalebar")
      .text(function(d) { return commas(d.barData2); })
    .transition()
      .attr("x", function(d) { return innerMargin - total(d.barData2) - 2 * labelSpace; });
}
});