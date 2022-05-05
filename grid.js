

const margin = {top: 0, right: 100, bottom: 0, left: 100},
  width = 1600 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
export let svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right).attr("transform",`translate(${margin.left}, ${margin.top})`).attr('class','grid').attr("height", height + margin.top + margin.bottom).call(d3.zoom().on("zoom", function () {
    svg.attr("transform", d3.event.transform)
 }))
.append("g")
  

        export let Tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  

