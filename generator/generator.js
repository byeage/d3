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


/*区域生成器*/
var dataset=[80,120,130,70,60,90];

var areaPath=d3.svg.area()
				.interpolate("basis")
				.interpolate("cardinal")
				.interpolate("step")
				.x(function(d,i){
					return 50+i*80;
				})
				.y0(function(d,i){
					return height/2;
				})
				.y1(function(d,i){
					return height/2-d;
				});

	
svg.append("path")
	.attr("d",areaPath(dataset))
	.attr("stroke","#000")
	.attr("stroke-width","3px")
	.attr("fill","yellow");