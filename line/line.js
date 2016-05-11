
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





var dataset=[
				{
					country:"china",
					gdp:[
						[2000,11920],
						[2001,13170],
						[2002,14170],
						[2003,16170],
						[2004,19170],
						[2005,22170],
						[2006,27170],
						[2007,35170],
						[2008,45170],
						[2009,51170],
						[2010,59417],
						[2011,73417],
						[2012,83417],
						[2013,100417]
					]
				},
				{
					country:"japan",
					gdp:[
						[2000,11920],
						[2001,23170],
						[2002,34170],
						[2003,16170],
						[2004,39170],
						[2005,52170],
						[2006,97170],
						[2007,105170],
						[2008,85170],
						[2009,71170],
						[2010,59417],
						[2011,63417],
						[2012,83417],
						[2013,100417]
					]
				}
		];
	




var padding={
			top:50,
			right:50,
			left:100,
			bottom:50
		};





var toArray=_.map(dataset,function(d){
	return d.gdp;
});

var toOne=d3.merge(toArray);

var GDP=d3.extent(toOne,function(d){
	return d[1];
});




var Year=[2000,2013];





var xScale=d3.scale.linear()
			.domain(Year)
			.range([0,width-padding.left-padding.right])
			.nice();


var yScale=d3.scale.linear()
			.domain(GDP)
			.range([height-padding.top-padding.bottom,0])
			.nice();			



var linePath=d3.svg.line()
				.interpolate("cardinal")
				.x(function(d){
					return xScale(d[0]);
				})
				.y(function(d){
					return yScale(d[1]);
				});

var shapePath=d3.svg.line();

var color=[d3.rgb(255,0,0),d3.rgb(0,255,0)];


var linesGroup=svg.selectAll("g")
					.data(dataset)
					.enter()
					.append("g")
					.classed("line-group",true);

var lines=linesGroup
	.append("path")
	.attr("transform",function(){
		return "translate("+padding.left+","+padding.top+")";
	})
	.attr("d",function(d,i){
		return linePath(d.gdp);
	})
	.attr("fill","none")
	.attr("stroke-width",2)
	.attr("stroke",function(d,i){
		return color[i];
	});

	//焦点元素	
var focusCircle=linesGroup.append("g")
					.attr("class","focusCircle")
					.style("display","none");
	focusCircle.append("circle")
				.attr("r",5);	


var focusTooltipsWidth=100;
var focusTooltipsHeight=40;
var focusTooltipsDx=20;
var focusTooltipsDy=20;
var focusTooltipsGap=5;
var focusTooltips=linesGroup.append("g")
					.attr("class","focusTooltips")
					.style("display","none");
var focusTooltipsShape=focusTooltips.append("path")
				 .attr("fill",function(d,i){
				 	return color[i];
				 });
	
var focusTooltipsText=focusTooltips.append("text")
				 .fill("color","#FFFFFF");				 				






/*坐标轴*/
			// .tickValues([2005])
var xAxis=d3.svg.axis()
			.scale(xScale)
			.ticks(10)
			.tickPadding(10)
			.tickFormat(d3.format("d"))
			.innerTickSize(-height+padding.top+padding.bottom)
			// .outerTickSize(-height+padding.top+padding.bottom)
			.orient("bottom");
	


var yAxis=d3.svg.axis()
			.scale(yScale)
			.ticks(10)
			.tickPadding(10)
			.innerTickSize(-width+padding.left+padding.right)
			// .outerTickSize(-width+padding.left+padding.right)
			.orient("left");


			svg.append("g")
				.attr("class","x axis")
				.attr("transform",function(d,i){
					return "translate("+(padding.left)+","+(height-padding.bottom)+")"
				})
				.attr("fill","none")
				.attr("stroke-width","1px")
				.attr("stroke","#000")
				.call(xAxis);


			svg.append("g")
			.attr("class","y axis")
			.attr("transform",function(d,i){
				return "translate("+(padding.left)+","+padding.top+")"
			})
			.attr("fill","none")
			.attr("stroke-width","1px")
			.attr("stroke","#000")
			.call(yAxis);

		






/*tooltips*/

svg.append("rect")
	.attr("class","cover")
	.attr("x",padding.left)
	.attr("y",padding.top)
	.attr("width",width-padding.left-padding.right)
	.attr("height",height-padding.bottom-padding.top)
	.attr("fill","rgba(0,0,0,0)")
	.on("mouseover",function(){
			focusCircle.style("display",null);
			focusLine.style("display",null);
			xCoord.style("display",null);
			focusTooltips.style("display",null);
	})
	.on("mouseout",function(){
			focusCircle.style("display","none");
			focusLine.style("display","none");
			xCoord.style("display","none");
			focusTooltips.style("display","none");
	})
	.on("mousemove",mousemove);







	//对齐线元素
		var focusLine=svg.append("g")
						.attr("class","focusLine")
						.style("display","none");
		var vLine=focusLine.append("line")
				.attr("stroke-width","1px")
				.attr("stroke","#000");
	//  坐标轴提示
		var xCoord=svg.append("g")
						.attr("class","xCoord")
					  .style("display","none");



		var xCoordRect=xCoord.append("rect")
						   .attr("width",50)
						   .attr("height",30)
						   .attr("y",height-padding.bottom)
						   .attr("fill","#000");
		var xCoordText=xCoord.append("text")
						.attr("fill","#fff")
						.attr("y",height-padding.bottom+20)
						.attr("text-anchor","middle");					   


	   

function mousemove(){

var data=dataset[0].gdp;

var mouseX=d3.mouse(this)[0]-padding.left;
var mouseY=d3.mouse(this)[1]-padding.top;

var x0=xScale.invert(mouseX);
var y0=yScale.invert(mouseY);
	x0=Math.round(x0);

var bisect=d3.bisector(function(d){
	return d[0];
}).left;

var index=bisect(data,x0);
var x1=data[index][0];
var y1=data[index][1];



var focusX=xScale(x1)+padding.left;
var focusY=yScale(y1)+padding.top;


vLine.attr("x1",focusX)
	 .attr("y1",padding.top)
	 .attr("x2",focusX)
	 .attr("y2",height-padding.bottom);



xCoordRect.attr("x",focusX-25);

xCoordText.attr("x",focusX)
			.text(x1);





focusCircle.attr("transform",function(d,i){
	var data=d.gdp;
	var bisect=d3.bisector(function(d){
		return d[0];
	}).left;

	var index=bisect(data,x0);
	var x1=data[index][0];
	var y1=data[index][1];
	var focusX=xScale(x1)+padding.left;
	var focusY=yScale(y1)+padding.top;

	return "translate("+focusX+","+focusY+")";

})
.attr("fill",function(d,i){
	return color[i];
});



var adjust=[];

focusTooltipsShape.each(function(d,i,a){
var data=d.gdp;
	var bisect=d3.bisector(function(d){
		return d[0];
	}).left;

	var index=bisect(data,x0);
	var x1=data[index][0];
	var y1=data[index][1];
	var focusX=xScale(x1)+padding.left;
	var focusY=yScale(y1)+padding.top;
	adjust.push([focusX,focusY,focusY]);

});





_.each(adjust,function(e,i,all){

    if(i==(all.length-1)){
      return;
    }

    if(Math.abs((all[i+1][1]-all[i][1]))<focusTooltipsHeight+focusTooltipsGap){
        all[i+1][1]=all[i][1]+focusTooltipsHeight+focusTooltipsGap;
    }


});





focusTooltipsShape.attr("d",function(d,i){
	

	var focusX=adjust[i][0];
	var focusY=adjust[i][1];
	var focusYOrigin=adjust[i][2];
	var path=[
				[focusX,focusYOrigin],
				[focusX+focusTooltipsDx,focusY-10-focusTooltipsDy],
				[focusX+focusTooltipsDx,focusY-focusTooltipsHeight-focusTooltipsDy],
				[focusX+focusTooltipsWidth+focusTooltipsDx,focusY-focusTooltipsHeight-focusTooltipsDy],
				[focusX+focusTooltipsWidth+focusTooltipsDx,focusY-focusTooltipsDy],
				[focusX+focusTooltipsDx,focusY-focusTooltipsDy]
			];
	return shapePath(path);
});


  




}