{
// chart width and height
var w = 1000;
var h = 600;
var padding = 40;

var dataset, xScale, yScale, xAxis, yAxis, cScale;  // empty
}

//loading data 
d3.csv("chronology/wild-per-year.csv")
.then(function(data) {
    // console.log(data);

    xScale = d3.scaleLinear()
        .domain([
            d3.min(data, function(d){
                return parseFloat(d["year"]);
            }),
            d3.max(data, function(d){
                return parseFloat(d["year"]);
            })
        ])
        .range([padding, w - padding]);

        // console.log(d3.max(data, function(d) {return d["year"]}))
    
    yScale = d3.scaleLinear() 
        .domain([
            -700,
            d3.max(data, function(d){ 
                return parseInt(d["acres-designated"].split(",").join(""));
            })
        ])
        .range([h - padding, padding])

    
    var rScale = d3.scaleLinear()
        .domain([
            d3.min(data, function(d){
                return parseInt(d["acres-designated"].split(",").join(""));
            })
            ,
            d3.max(data, function(d){
                return parseInt(d["acres-designated"].split(",").join(""));
            })
        ])
        .range([1,50]);
       
        
    //define X axis
    xAxis = d3.axisBottom()
                      .scale(xScale)
                      .ticks(48) //45 values in array

    //define Y axis
    yAxis = d3.axisLeft()
                      .scale(yScale)
                      .ticks(36);
                      

    //create SVG element
    var svg = d3.select("#chronology-plot")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
    

    //create circles
    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", function(d) {
        // console.log(parseInt(d["year"]))
            return xScale(parseInt(d["year"]));
       })
       .attr("cy", function(d, i) { //WHY ADD i HERE?
            return yScale(d["acres-designated"].split(",").join(""));
       })
       .attr("r", function(d){
        // console.log([d["acres-designated"], rScale(d["acres-designated"])])
        // return 5
            return rScale(Math.abs(d["acres-designated"].split(",").join("")))
        })
    
    // circle colors
       .style("fill", function(d){
           console.log(d)
           if(d.party== "Democratic"){
               return "blue"
           }else{
               return "red"
           }
       })

});