var d3 = require('d3');

var Chart = {};

Chart.create = function(el){

	function on_brush(brush) {

        var s = brush.extent();
        d3.selectAll(".circle").classed("selected", function (d) {
            var time = get_time(d);
            return s[0] <= time && time <= s[1];
        });
    }

    function get_time(d) {
            return d3.time.format.iso.parse(d.properties.origintime);
    }

    function get_magnitude(d) {
        return +d.properties.magnitude;
    }

    var scheme = ["rgb(215,48,39)","rgb(244,109,67)","rgb(253,174,97)","rgb(254,224,144)","rgb(255,255,191)","rgb(224,243,248)","rgb(171,217,233)","rgb(116,173,209)","rgb(69,117,180)"];

  

	// Chart dimensions.
	var margin = {top: 19.5, right: 0, bottom: 19.5, left: 44.5},
	    width = 1000 - margin.right,
	    height = 400 - margin.top - margin.bottom;

	// Various scales. These domains make assumptions of data, naturally.
	var xScale = d3.scale.log().domain([300, 1e5]).range([0, width]),
	    yScale = d3.scale.linear().domain([10, 85]).range([height, 0]),
	    radiusScale = d3.scale.sqrt().domain([0, 5e8]).range([0, 40]),
	    colorScale = d3.scale.category20c();

	// The x & y axes.
	var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(12, d3.format(",d")),
	    yAxis = d3.svg.axis().scale(yScale).orient("left");

	// Create the SVG container and set the origin.
	var svg = d3.select(el).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Add the x-axis.
	svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);

	// Add the y-axis.
	svg.append("g")
	    .attr("class", "y axis")
	    .call(yAxis);

	var color = d3.scale.category10();

	d3.json('assets/data/event.json', function(event) {

		console.log(event);

		var dot = svg.append("g")
	      	.attr("class", "dots")
	      	.selectAll("circle")
	      	.data(event.attack)
	      	.enter().append("circle")
	      	.attr("class", "circle")
	      	.attr({
	      		cx: function(it){ return Math.random() * 900 + 4;},
	      		cy: function(it){ return Math.random() * 300 + 4;},
	      		r:  function(it){ return it.properties.depth*3;},
	      		fill: function(it){ return color(it.properties.depth % 3);}
	      	})
	      	.sort(function(a, b) {
    return b.properties.depth - a.properties.depth;
  });
	      	// .on("click", toggleDot);

	    var chart = timeseries_chart(scheme)
                    .x(get_time).xLabel("Earthquake origin time")
                    .y(get_magnitude).yLabel("Magnitude")
                    .brushmove(on_brush);

   		 d3.select("body").datum(event.attack).call(chart);
	});


	function timeseries_chart(color) {
        var margin = { top: 5, right: 5, bottom: 40, left: 45 },
            width = 1050 - margin.left - margin.right,
            height = 80;

        var x = d3.time.scale(),
            y = d3.scale.linear(),
            x_label = "X", y_label = "Y",
            brush = d3.svg.brush().x(x).on("brush", _brushmove);

        var get_x = no_op,
            get_y = no_op;

        function timeseries(selection) {
            selection.each(function (d) {

                x.range([0, width]);
                y.range([height, 0]);

                var series = d3.select(this).append("svg").attr("id", "quake-timeseries")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g").attr("id", "date-brush")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var x_axis = series.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")");

                var y_axis = series.append("g")
                        .attr("class", "y axis");

                x_axis.append("text")
                    .attr("class", "label")
                    .attr("x", width)
                    .attr("y", 30)
                    .style("text-anchor", "end")
                    .text(x_label);

                y_axis.append("text")
                    .attr("class", "label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -40)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text(y_label);

                series.append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", width - 1)
                    .attr("height", height - .25)
                    .attr("transform", "translate(1,0)");

                series.append("g")
                        .attr("class", "brush")
                        .call(brush)
                        .selectAll("rect")
                        .attr("height", height)
                        .style("stroke-width", 1)
                        .style("stroke", color[color.length - 1])
                        .style("fill", color[2])
                        .attr("opacity", 0.4);

                x.domain(d3.extent(d, get_x));
                x_axis.call(d3.svg.axis().scale(x).orient("bottom"));

                y.domain(d3.extent(d, get_y));
                y_axis.call(d3.svg.axis().scale(y).orient("left"));

                console.log(d);

                series.append("g").attr("class", "timeseries")
                    .attr("clip-path", "url(#clip)")
                    .selectAll("circle")
                    .data(d).enter()
                    .append("circle")
                    .style("stroke", color[color.length - 2])
                    .style("stroke-width", .5)
                    .style("fill", color[color.length - 1])
                    .attr("opacity", .4)
                    .attr("r", 3)
                    .attr("transform", function (d) {
                        return "translate(" + x(get_x(d)) + "," + y(get_y(d)) + ")";
                    });
            });
        }

        timeseries.x = function (accessor) {
            if (!arguments.length) return get_x;
            get_x = accessor;
            return timeseries;
        };

        timeseries.y = function (accessor) {
            if (!arguments.length) return get_y;
            get_y = accessor;
            return timeseries;
        };

        timeseries.xLabel = function (label) {
            if (!arguments.length) return x_label;
            x_label = label;
            return timeseries;
        };

        timeseries.yLabel = function (label) {
            if (!arguments.length) return y_label;
            y_label = label;
            return timeseries;
        };

        timeseries.brushmove = function (cb) {
            if (!arguments.length) return _brushmove;
            _brushmove = cb;
            return timeseries;
        };

        function _brushmove() {
            on_brush.call(null, brush);
        }

        function no_op() {}

        return timeseries;
    }
};

Chart.filter = function(){
	d3.selectAll(".circle").attr({ r:  function(it){ 
		if(Math.random() > 0.3 ) return 0;
	    else return it.properties.depth*3;} });
}

module.exports = Chart;
