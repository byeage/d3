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
/*符号生成器*/


/*
*d3.svg.symbol 创建符号生成器
* 	-symbol 返回指定符号断点路径字符串
* 	- symbol.type 设置或获取符号类型
* 	- symbol.size 设置或获取符号大小，单位为像素的平方
* 	- d3.svg.symbolTypes 支持符号的类型
 */


console.log(d3.svg.symbolTypes);

var n=30;
var dataset=[];

for(var i=0;i<n;i++){
	dataset.push({
		size:Math.random()*30+200,
		type:d3.svg.symbolTypes[Math.floor(Math.random()*d3.svg.symbolTypes.length)]
	});
}

var symbol=d3.svg.symbol()
				.size(function(d){
					return d.size;
				})
				.type(function(d){
					return d.type;
				});



var color=d3.scale.category20();

svg.selectAll("path")
	.data(dataset)
	.enter()
	.append("path")
	.attr("d",function(d){
		return symbol(d);
	})
	.attr("transform",function(d,i){
			var x=100+i%5*20;
			var y=100+Math.floor(i/5)*20;
			return 'translate('+x+","+y+')';
	})
	.attr("fill",function(d,i){
		return color(i);
	});
