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

var lines=[[80,80],[200,100],[200,200],[100,200]];
var lines=[80,120,160,200,240,280];
var linePath=d3.svg.line()
				.interpolate("linear")//直線
			  /*.interpolate("linear-closed")//直线闭合
				 .interpolate("basis")
				.interpolate("cardinal")*/
				.x(function(d){
					return d;
				})
				.y(function(d,i){
					return i%2 ==0 ?40:120;
				})
				/*.defined(function(d){
					return d<200;    //绘制返回为true的数据
				});*/

				svg.append("path")
					.attr("d",linePath(lines))
					.attr("stroke","black")
					.attr("stroke-width","3px")
					.attr("fill","none");

	
