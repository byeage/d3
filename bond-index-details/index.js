var margin = {top: 150, right: 10, bottom: 100, left: 40},
    margin2 = {top: 30, right: 10, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 100 - margin2.top - margin2.bottom;

var parseDate = d3.time.format("%b %Y").parse;

var x = d3.time.scale().range([0, width]),
    x2 = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg
            .axis()
            .scale(x)
            .tickPadding(25)
            .tickFormat(d3.time.format("%Y/%m"))
            .innerTickSize(-height)
            .outerTickSize(0)
            .orient("bottom"),
    xAxis2 = d3.svg.axis()
               .scale(x2)
               .innerTickSize(0)
               .outerTickSize(0)
               .tickFormat("")
               .orient("bottom"),
    yAxis = d3.svg.axis()
                  .scale(y)
                  .tickPadding(10)
                  .innerTickSize(-width)
                  .outerTickSize(0)
                  .orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .on("brushstart",function(){})
    .on("brush", brushed)
    .on("brushend",function(){
    	/*	console.log( brush.extent())*/
    });
//线段生成器 带比例尺
var line=d3.svg.line()
               .interpolate("monotone")
               .x(function(d){
                  return x(d.date);
                })
               .y(function(d){
                  return y(d.price);
                });

//线段生成器 不带比例尺
var shapePath=d3.svg.line();
var area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.price); });

var area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x2(d.date); })
    .y0(height2)
    .y1(function(d) { return y2(d.price); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);








svg.append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

var gradient=svg.append("defs")
        .append("linearGradient")
        .attr("id","gradient")
        .attr("x1","0%")
        .attr("y1","0%")
        .attr("x2","0%")
        .attr("y2","100%");

    gradient.append("stop")
            .attr("offset","0%")
            .attr("stop-color","#F89223")
            .attr("stop-opacity",0.4);  
    gradient.append("stop")
            .attr("offset","100%") 
            .attr("stop-color","#F89223")
            .attr("stop-opacity",0); 






var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");



var toolTips=svg.append("g")
                .attr("class","toolTips");
             




//对齐线元素
var focusLine=toolTips.append("g")
        .attr("class","focusLine");
//垂直Y轴线       
var vLine=focusLine.append("line")
        .attr("class","vline")
        .attr("fill","none")
        .attr("stroke-width",1)
        .attr("opacity",0.8)
        .attr("stroke","#000000");


//坐标轴提示
var focusCoord=toolTips.append("g")     
        .attr("class","focusCoord");
   


var focusCoordUp=focusCoord.append("path")
          .attr("class","coordUp")
          .attr("fill","#070c46");

var focusCoordUpText=focusCoord.append("text")
          .attr("class","coordUpText")
          .attr("text-anchor","middle")
          .attr("fill","#FFFFFF")
          .style({
            "font-size":12
          });


var focusCoordDown=focusCoord.append("path")
          .attr("class","coordDown")
          .attr("fill","#070c46");
          

var focusCoordDownText=focusCoord.append("text")
          .attr("class","coordUpText")
          .attr("text-anchor","middle")
          .attr("fill","#FFFFFF")
          .style({
            "font-size":12
          });


















d3.csv("index.csv", type, function(error, data) {


  x.domain(d3.extent(data.map(function(d) { return d.date; })));
  y.domain([0, d3.max(data.map(function(d) { return d.price; }))]);
  x2.domain(x.domain());
  y2.domain(y.domain());



  var last=data[data.length-1];
  var previous=data[data.length-30];
      brush.extent([previous.date,last.date]);
      brushed(); 
  focus.append("path")
        .datum(data)
        .attr("class","focus-line")
        .attr("d",line)
        .attr("fill","none")
        .attr("stroke","#F19722")
        .attr("stroke-width",2);

  focus.append("path")
      .datum(data)
      .attr("class", "focus-area")
      .attr("d", area);

  focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  context.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area2);

  context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);
  context.append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", height2 + 7);



var resize=d3.selectAll(".resize rect");
  
    resize.attr("fill","#F89223")
          .attr("width",15)
          .style("visibility","visible")



svg.append("rect")
  .attr("class","cover")
  .attr("x",margin.left)
  .attr("y",margin.top)
  .attr("width",width)
  .attr("height",height)
  .attr("fill","rgba(0,0,0,0)")
  .on("mouseover",function(){
      toolTips.style("display",null);
  })
  .on("mouseout",function(){

      toolTips.style("display","none");
   
  })
  .on("mousemove",mousemove);
   



function mousemove(){


var mouseX=d3.mouse(this)[0]-margin.left;
var mouseY=d3.mouse(this)[1]-margin.top;
var focusX=d3.mouse(this)[0];
var x0=x.invert(mouseX);
var y0=y.invert(mouseY);



var bisect=d3.bisector(function(d){
    return d.date;
  }).left;

  var index=bisect(data,x0);

  console.log(index)
  var xValue=data[index].date;
  var yValue=data[index].price;

  focusX=x(xValue)+margin.left;
  focusY=y(yValue)+margin.top;

  vLine.attr("x1",focusX)
     .attr("y1",margin.top)
     .attr("x2",focusX)
     .attr("y2",height+margin.top);



var coordUp=[focusX,margin.top];
var coordDown=[focusX,height+margin.top];

focusCoordUp.attr("d",function(){
  return shapePath(getcoordUpPath(coordUp,tooltipCoordUp));
});



focusCoordUpText.attr("x",focusX)
        .attr("y",margin.top-tooltipCoordUp.tH)
        .text(function(){
          return yValue.toFixed(2);
        });


focusCoordDown.attr("d",function(){
  return shapePath(getcoordDownPath(coordDown,tooltipCoordDown));
});



focusCoordDownText.attr("x",focusX)
        .attr("y",height+margin.top+tooltipCoordDown.h/2+tooltipCoordDown.tH)
        .text(function(){
          var format = d3.time.format("%Y/%m/%d");
          // return format(xValue);
            return format(x0);
        });         


}



});





function brushed() {
  x.domain(brush.empty() ? x2.domain() : brush.extent());
  focus.select(".focus-area").attr("d", area);
  focus.select(".focus-line").attr("d", line);
  focus.select(".x.axis").call(xAxis);

}

function type(d) {
  d.date = parseDate(d.date);
  d.price = +d.price;
  return d;
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



function getcoordUpPath(f,c){

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
  
}


function getcoordDownPath(f,c){

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
  
}