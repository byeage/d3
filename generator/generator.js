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


/*弧生成器*/

/**
 * 起始角度 startAngle
 * 终止角度 endAngle
 * 内半径 innerRadius
 * 外半径 outerRadius
 */


var dataset=[
			{
				startAngle:0,
				endAngle:Math.PI*0.75
			},
			{
				startAngle:Math.PI*0.75,
				endAngle:Math.PI*1
			}
			];


var color=d3.scale.category10();
var arcPath=d3.svg.arc()
				.innerRadius(0)
				.outerRadius(100);
	svg.selectAll("path")
		.data(dataset)
		.enter()
		.append("path")
		.attr("d",function(d,i){
			return arcPath(d);
		})
		.attr("transform","translate(250,250)")
		.attr("stroke-width","3px")
		.attr("stroke","#000")
		.attr("fill",function(d,i){
			return color(i);
		});	

/*给每段弧线添加文字*/

svg.selectAll("text")
	.data(dataset)
	.enter()
	.append("text")
	.attr("transform",function(d,i){
		return "translate(250,250)"+
			"translate("+arcPath.centroid(d)+")";
	})
	.attr("text-anchor","middle")
	.attr("fill","#fff")
	.attr("font-size","18px")
	.text(function(d,i){
		return Math.floor((d.endAngle-d.startAngle)*180/Math.PI)+"'";
	});
