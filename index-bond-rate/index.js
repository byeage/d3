
var width = $("body").width();
var height = $("body").height();
var svg=d3.select("body")
			.append("svg")
			.attr("id","main")
			.attr("width", width)
			.attr("height", height);

var date=+new Date(2015,5,2,0,0,0);
var indexData=[];
for(var i=0;i<180;i++){
	indexData.push([date+i*24*60*60*1000,156+Math.random()*30]);
}

console.log(indexData);


var dataset=[
				{
				  name:"中债指数",
				  data:indexData
				}
				 
		];
	




var padding={
			top:50,
			right:50,
			left:100,
			bottom:50
		};





var toArray=_.map(dataset,function(d){
	return d.data;
});

var toOne=d3.merge(toArray);
//收益率区间
var index=d3.extent(toOne,function(d){
	return d[1];
});

/*console.log(index)
var xAxisCoords=[0.5,3,5,9,15,20,30,50];
var gap=((index[1]-index[0])/5)
console.log(gap)
var indexLow=Math.floor(index[0]/gap)*gap;
var indexHigh=Math.ceil(index[1]/gap)*gap;
	index=[indexLow,indexHigh];
	console.log(index)

var yAxisCoords=d3.range(indexLow,indexHigh+0.01,gap);*/

	




//时间区间
var time=d3.extent(toOne,function(d){
	return d[0];
});



//x轴比例尺
var xScale=d3.time.scale()
			.domain(time)
			.range([0,width-padding.left-padding.right])
			.nice();
			

//y轴比例尺
var yScale=d3.scale.linear()
			.domain(index)
			.range([height-padding.top-padding.bottom,0])
			.nice();			


//线段生成器 带比例尺
var linePath=d3.svg.line()
				.interpolate("cardinal")
				.x(function(d){
					return xScale(d[0]);
				})
				.y(function(d){
					return yScale(d[1]);
				});
//线段生成器 不带比例尺
var shapePath=d3.svg.line();
//线段颜色
var color="#ef9907";

//线段分组
var linesGroup=svg.selectAll("g")
					.data(dataset)
					.enter()
					.append("g")
					.classed("line-group",true);

//曲线
var lines=linesGroup
	.append("path")
	.attr("transform",function(){
		return "translate("+padding.left+","+padding.top+")";
	})
	.attr("d",function(d,i){
		return linePath(d.data);
	})
	.attr("fill","none")
	.attr("stroke-width",2)
	.attr("stroke",function(d,i){
		return color;
	});


/*坐标轴*/

// x轴
var xAxis=d3.svg.axis()
			.scale(xScale)
			.tickPadding(25)
			.tickFormat(d3.time.format("%Y/%m"))
			.innerTickSize(-height+padding.top+padding.bottom)
			.outerTickSize(0)
			.orient("bottom");
// y轴
var yAxis=d3.svg.axis()
			.scale(yScale)
			.tickPadding(10)
			.innerTickSize(-width+padding.left+padding.right)
			.outerTickSize(0)
			.orient("left");



			svg.append("g")
				.attr("class","x axis")
				.attr("transform",function(d,i){
					return "translate("+(padding.left)+","+(height-padding.bottom)+")";
				})
				.call(xAxis);


				svg.append("g")
				.attr("class","y axis")
				.attr("transform",function(d,i){
					return "translate("+(padding.left)+","+padding.top+")";
				})
				.call(yAxis);

		






/*********************ToolTips**************************************/
//焦点元素	
var focusCircle=linesGroup.append("g")
					.attr("class","focusCircle")
					.style("display","none");
	focusCircle.append("circle")
				.attr("r",5);	

			 				


//对齐线元素
var focusLine=svg.append("g")
				.attr("class","focusLine")
				.style("display","none");
//垂直Y轴线				
var vLine=focusLine.append("line")
				.attr("class","vline")
				.attr("fill","none")
				.attr("stroke-width",1)
				.attr("opacity",0.8)
				.attr("stroke","#000000");




	  		    

//坐标轴提示
var focusCoord=svg.append("g")	   
				.attr("class","focusCoord")
				.style("display","none");


var	focusCoordUp=focusCoord.append("path")
				  .attr("class","coordUp")
				  .attr("fill","#070c46");

var	focusCoordUpText=focusCoord.append("text")
				  .attr("class","coordUpText")
				  .attr("text-anchor","middle")
				  .attr("fill","#FFFFFF")
				  .style({
				  	"font-size":12
				  });
		  

var	focusCoordDown=focusCoord.append("path")
				  .attr("class","coordDown")
				  .attr("fill","#070c46");
				  

var	focusCoordDownText=focusCoord.append("text")
				  .attr("class","coordUpText")
				  .attr("text-anchor","middle")
				  .attr("fill","#FFFFFF")
				  .style({
				  	"font-size":12
				  });

				  



//坐标轴提示

svg.append("rect")
	.attr("class","cover")
	.attr("x",padding.left)
	.attr("y",padding.top)
	.attr("width",width-padding.left-padding.right)
	.attr("height",height-padding.bottom-padding.top)
	.attr("fill","rgba(0,0,0,0)")
	.on("mouseover",function(){
			focusLine.style("display",null);
			focusCoord.style("display",null);
	})
	.on("mouseout",function(){

			focusLine.style("display","none");
			focusCoord.style("display","none");
	})
	.on("mousemove",mousemove);	   

function mousemove(){

var data=dataset[0].data;
var mouseX=d3.mouse(this)[0]-padding.left;
var mouseY=d3.mouse(this)[1]-padding.top;
var focusX=d3.mouse(this)[0];
var x0=xScale.invert(mouseX);
var y0=yScale.invert(mouseY);


	var bisect=d3.bisector(function(d){
		return d[0];
	}).left;

	var index=bisect(data,x0);
	var x1=data[index][0];
	var y1=data[index][1];

	var focusX=xScale(x1)+padding.left;
	var focusY=yScale(y1)+padding.top;


	console.log(x1,y1)

vLine.attr("x1",focusX)
	 .attr("y1",padding.top)
	 .attr("x2",focusX)
	 .attr("y2",height-padding.bottom);


















var coordUp=[focusX,padding.top];
var coordDown=[focusX,height-padding.bottom];

focusCoordUp.attr("d",function(){
	return shapePath(getcoordUpPath(coordUp,tooltipCoordUp));
});

focusCoordUpText.attr("x",focusX)
				.attr("y",padding.top-tooltipCoordUp.tH)
				.text(function(){
					return y1.toFixed(2)
				});


focusCoordDown.attr("d",function(){
	return shapePath(getcoordDownPath(coordDown,tooltipCoordDown));
});



focusCoordDownText.attr("x",focusX)
				.attr("y",height-padding.bottom+tooltipCoordDown.h/2+tooltipCoordDown.tH)
				.text(function(){
					var format = d3.time.format("%Y/%m/%d");
						return format(x0);
				});	
}


var tooltipCoordUp={
	w:76,
	h:20,
	tH:6,
	tW:6
};

var tooltipCoordDown={
	w:100,
	h:20,
	tH:6,
	tW:6
};


var getcoordUpPath=function(f,c){

	f[1]=f[1]+c.tH;
	return [
			[f[0],f[1]],
			[f[0]+c.tW/2,f[1]-c.tH],
			[f[0]+c.w/2,f[1]-c.tH],
			[f[0]+c.w/2,f[1]-c.tH-c.h],
			[f[0]-c.w/2,f[1]-c.tH-c.h],
			[f[0]-c.w/2,f[1]-c.tH],
			[f[0]-c.tW/2,f[1]-c.tH],
	];
	
};


var getcoordDownPath=function(f,c){

	f[1]=f[1]-c.tH;
	return [
			[f[0],f[1]],
			[f[0]+c.tW/2,f[1]+c.tH],
			[f[0]+c.w/2,f[1]+c.tH],
			[f[0]+c.w/2,f[1]+c.tH+c.h],
			[f[0]-c.w/2,f[1]+c.tH+c.h],
			[f[0]-c.w/2,f[1]+c.tH],
			[f[0]-c.tW/2,f[1]+c.tH],
	];
	
};
