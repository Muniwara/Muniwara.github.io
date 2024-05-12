// The svg
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
    .scale(70)
    .center([0, 40])
    .translate([width / 2, height / 2]);

// Data and color scale
var data = d3.map();
var colorScheme = d3.schemeBlues[6];
colorScheme.unshift("#eee")
var colorScale = d3.scaleThreshold()
    .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
    .range(colorScheme);
// .range(d3.schemeBlues[7]);

// // Legend
var g = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,20)");
g.append("text")
     .attr("class", "caption")
    .attr("x", 0)
     .attr("y", -6)
    .text("Countries");
 var labels = ['1-100000', '100001-1000000' , '1000001-10000000', '10000001-30000000', '30000001-100000000', '100000001-500000000', '> 500000000'];
var legend = d3.legendColor()
     .labels(function (d) { return labels[d.i]; })
    .shapePadding(4)
    .scale(colorScale);
 svg.select(".legendThreshold")
     .call(legend);

// Load external data and boot
d3.queue()
    //   .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    // .defer(d3.csv, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) { data.set(d.code, +d.pop); })
    .defer(d3.json, "data/world.geojson")
    .defer(d3.csv, "data/current_population.csv", function (d) { data.set(d.code, +d.pop_2023); })
    .await(ready);

function ready(error, topo) {

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
            d.total = data.get(d.id) || 0;
            return colorScale(d.total);
        });
}

