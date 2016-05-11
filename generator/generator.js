var a = d3.rgb(255, 0, 0);
var b = d3.rgb(0, 255, 0);
var compute = d3.interpolate(a, b);
var width = $("body").width();
var height = $("body").height();
var svg=d3.select("body")
			.append("svg")
			.attr("id","main")
			.attr("width", width)
			.attr("height", height);

			