

d3.json('./index.json', function(err, data) {
  if(err){
    console.log(err);
    return false;
  }


var margin = {top: 150, right: 40, bottom: 300, left: 40},
    margin2 = {top: 30, right: 40, bottom: 20, left: 40},
    margin3={top:500,right:40,bottom:20,left:40},
    width = 960 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom,
    height2 = 100 - margin2.top - margin2.bottom,
    height3=800-margin3.top-margin3.bottom;



var parseDate = d3.time.format("%b %Y").parse;

var x = d3.scale.linear().range([0, width]),
    x2 = d3.scale.linear().range([0, width]),
    x3= d3.scale.ordinal().rangeBands([0, width],0),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]),
    y3=d3.scale.linear().range([height3,0]);





 var    xAxis2 = d3.svg.axis()
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
                  .orient("left"),  
      yAxis3 = d3.svg.axis()
                  .scale(y3)
                  .tickPadding(10)
                  .innerTickSize(-width)
                  .outerTickSize(0)
                  .orient("left");






var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed)
    .on("brushend",brushEnd);
//线段生成器 带比例尺
var line=d3.svg.line()
               .interpolate("monotone")
               .x(function(d){
                  return x(d.time);
                })
               .y(function(d){
                  return y(d.y1);
                });

//线段生成器 不带比例尺
var shapePath=d3.svg.line();
var area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x(d.time); })
    .y0(height)
    .y1(function(d) { return y(d.y1); });

var area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x2(d.time); })
    .y0(height2)
    .y1(function(d) { return y2(d.y1); });

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


var bar=svg.append("g")
        .attr("class","bar")
        .attr("transform","translate("+margin3.left+","+margin3.top+")");




var toolTips=svg.append("g")
                .attr("class","toolTips")

//对齐线元素
var focusLine=toolTips.append("g")
        .attr("class","focusLine");
//垂直Y轴线       
var vLine=focusLine.append("line")
        .attr("class","vline")
        .attr("fill","none")
        .attr("stroke-width",1)
        .attr("opacity",0.8)
        .attr("stroke","#000000")
        .style("display","none")
var vLine3=focusLine.append("line")
        .attr("class","vline")
        .attr("fill","none")
        .attr("stroke-width",1)
        .attr("opacity",0.8)
        .attr("stroke","#000000")
        .style("display","none");

var hLine= focusLine.append("line")
        .attr("class","hline")
        .attr("fill","none")
        .attr("stroke-width",1)
        .attr("opacity",0.8)
        .attr("stroke","#000000")
        .style("display","none");


var hLine3   = focusLine.append("line")
        .attr("class","hline")
        .attr("fill","none")
        .attr("stroke-width",1)
        .attr("opacity",0.8)
        .attr("stroke","#000000")
        .style("display","none");






var step=[0,60,120,181,241];
var allsteps=[0,60,120,181,241,
            242,302,362,423,483,
            484,544,604,665,725,
            726,786,846,907,967,
            968,1028,1088,1149,1209];

function brushed(){}

function brushEnd(){

  var tt=brush.empty() ? x2.domain() : brush.extent();

  var px2=tt[1];
  var px1=tt[0];

  var dx=px2-px1;

  if(dx<242){
       dx=242;
      px2=px1+dx;
  }

  if(px1>968){
    px1=968;
    px2=px1+242;
  }


  var scale=Math.round((px2-px1)/242);  
  var pxx1=Math.round(px1/242)*242;
  var pxx2=pxx1+scale*242;



    tt=[pxx1,pxx2];
 


    if(pxx2-pxx1>242){
        xAxis
          .tickValues(allsteps)
          .tickFormat(formatDay);
    }else{
        var ssss=_.map(step,function(d){
              return Math.round(px1/242)*242+d;
         });

      xAxis
      .tickValues(ssss)
      .tickFormat(formatHour);
    }


  x.domain(tt);
   brush.extent(tt);
  x3.domain((d3.range(tt[0],tt[1],1)));
console.log(brush.extent())

 if(!d3.event){
      focus.select(".focus-area").attr("d", area);
      focus.select(".focus-line").attr("d", line);
      focus.select(".x.axis").call(xAxis);
      bar.selectAll("rect")
      .attr("x",function(d,i){
         return x3(i);
      })
      .attr("y",function(d,i){
        return height3- y3(d.y1);
      })
      .attr("width",function(d,i){
          return 1;
      })
      .attr("height",function(d,i){
        return y3(d.y1);
      });
    
      return false;
  }else{

  if (!d3.event.sourceEvent){
     return;// only transition after input
  } 

   d3.select(this).transition()
      .duration(brush.empty() ? 0 : 750)
      .call(brush.extent(tt))
      .call(brush.event);

  focus.select(".focus-area").attr("d", area);
  focus.select(".focus-line").attr("d", line);
  focus.select(".x.axis").call(xAxis);
  bar.selectAll("rect")
      .attr("x",function(d,i){
         return x3(i);
      })
      .attr("y",function(d,i){
        return height3- y3(d.y1);
      })
      .attr("width",function(d,i){
          return 1;
      })
      .attr("height",function(d,i){
        return y3(d.y1);
      });
  }














    }





/*=========================================================================*/



  var time1=[];
  var time2=[];
  var time3=[];
  var time4=[];
  var time5=[];
  var day=24*60*60*1000;
    _.each(data,function(e,v){
        time5.push(e.tradeDate);
        time4.push(e.tradeDate-day);
        time3.push(e.tradeDate-2*day);
        time2.push(e.tradeDate-3*day);
        time1.push(e.tradeDate-4*day);
    });




  var times=time1.concat(time2,time3,time4,time5);
  var buildData=[];
  _.each(times,function(time,i){
    buildData.push({
        time:i,
        datetime:time,
        y1:Math.random()*20+100,
        y2:Math.random()*30+50
    });
  });

var datetime=_.map(buildData,function(d){return d.datetime});











function formatHour(d){

                if(getTime(datetime[d])=="9:30"){
                    return "9:30";
                }
                if(getTime(datetime[d])=="10:30"){
                    return "10:30";
                }
                if(getTime(datetime[d])=="11:30"){
                    return "11:30/13:00";
                }

                if(getTime(datetime[d])=="14:0"){
                    return "14:00";
                }
                if(getTime(datetime[d])=="15:0"){
                    return "15:00";
                }

}


var Week=["日","一","二","三","四","五","六"];


function formatDay(d){




      if(getTime(datetime[d])=="11:30"){

        var t=new Date(datetime[d]);
        var y=t.getFullYear();
        var m=t.getMonth()+1;
        var d=t.getDate();
        var w=t.getDay();
          return y+"/"+m+"/"+d+"/"+Week[w];
      }

               
}



function getTime(t){
var a=new Date(t);
    var h=a.getHours();
    var m=a.getMinutes();

    return h+":"+m;

}



 xAxis = d3.svg
            .axis()
            .scale(x)
            .tickPadding(25)
            .tickValues(allsteps)
            .tickFormat(formatHour)
            .innerTickSize(-height)
            .outerTickSize(0)
            .orient("bottom");

  xAxis=d3.svg
          .axis()
          .scale(x)
          .tickPadding(25)
            .tickValues(allsteps)
            .tickFormat(formatHour)
            .innerTickSize(-height)
            .outerTickSize(0)
            .orient("bottom");



  x.domain([0,buildData.length]);
  y.domain([0, d3.max(buildData.map(function(d) { return d.y1; }))]);
  x2.domain(x.domain());
  x3.domain(d3.range(buildData.length));
  y2.domain(y.domain());
  y3.domain(y.domain());








bar.selectAll("rect")
    .data(buildData)
    .enter()
    .append("rect")
    .attr("x",function(d,i){
       return x3(i);
    })
    .attr("y",function(d,i){
      return height3- y3(d.y1);
    })
    .attr("width",function(d,i){
        return 1;
    })
    .attr("height",function(d,i){
      return y3(d.y1);
    })
    .attr("fill","red");




      brush.extent([970,1210]);
      brushEnd();



  focus.append("path")
          .datum(buildData)
          .attr("class","focus-line")
          .attr("d",line)
          .attr("fill","none")
          .attr("stroke","#F19722")
          .attr("stroke-width",2);

    focus.append("path")
        .datum(buildData)
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
      .datum(buildData)
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




   bar.append("g")
   .attr("class","y axis")
   .call(yAxis3);  






svg.append("rect")
  .attr("class","cover line")
  .attr("x",margin.left)
  .attr("y",margin.top)
  .attr("width",width)
  .attr("height",height)
  .attr("fill","rgba(0,0,0,0)")
  .on("mouseover",function(){
       console.log("mouseover")
  })
  .on("mouseout",function(){

    vLine.style("display","none");
    vLine3.style("display","none");
    hLine.style("display","none");


   
  })
  .on("mousemove",function(){
  

        var mouseX=d3.mouse(this)[0]-margin.left;
        var mouseY=d3.mouse(this)[1]-margin.top;
        var focusX=d3.mouse(this)[0];
        var x0=x.invert(mouseX);
        var y0=y.invert(mouseY);





        var bisect=d3.bisector(function(d){
            return d.time;
          }).left;

          var index=bisect(buildData,x0);



          var xValue=buildData[index].time;
          var yValue=buildData[index].y1;




          focusX=x(xValue)+margin.left;
          focusY=y(yValue)+margin.top;





          vLine.style("display",null)
                .attr("x1",focusX)
                .attr("x2",focusX)
                .attr("y1",margin.top)
                .attr("y2",margin.top+height);

         vLine3.style("display",null)
                .attr("x1",focusX)
                .attr("x2",focusX)
                .attr("y1",margin3.top)
                .attr("y2",margin3.top+height3);   


         hLine.style("display",null)
              .attr("x1",margin.left)
              .attr("x2",margin.left+width)
              .attr("y1",mouseY+margin.top)           
              .attr("y2",mouseY+margin.top);           


  });



  svg.append("rect")
  .attr("class","cover bar")
  .attr("x",margin3.left)
  .attr("y",margin3.top)
  .attr("width",width)
  .attr("height",height3)
  .attr("fill","rgba(0,0,0,0)")
  .on("mouseover",function(){
       console.log("mouseover 3")
  })
  .on("mouseout",function(){

    vLine.style("display","none");
    vLine3.style("display","none");
    hLine3.style("display","none");
        console.log("mouseout 3")
   
  })
  .on("mousemove",function(){
        






var mouseX=d3.mouse(this)[0]-margin.left;
var mouseY=d3.mouse(this)[1]-margin.top;
var focusX=d3.mouse(this)[0];
var x0=x.invert(mouseX);
var y0=y.invert(mouseY);







var bisect=d3.bisector(function(d){
    return d.time;
  }).left;

  var index=bisect(buildData,x0);



  var xValue=buildData[index].time;
  var yValue=buildData[index].y1;






  focusX=x(xValue)+margin.left;
  focusY=y(yValue)+margin.top;





  vLine.style("display",null)
        .attr("x1",focusX)
        .attr("x2",focusX)
        .attr("y1",margin.top)
        .attr("y2",margin.top+height);

 vLine3.style("display",null)
        .attr("x1",focusX)
        .attr("x2",focusX)
        .attr("y1",margin3.top)
        .attr("y2",margin3.top+height3);   



 hLine3.style("display",null)
      .attr("x1",margin.left)
      .attr("x2",margin.left+width)
      .attr("y1",mouseY+margin.top)           
      .attr("y2",mouseY+margin.top); 



  });

























});