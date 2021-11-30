// chart width and height
{
var w = 1000;
var h = 600;
var padding = 40;

var colorDictionary = {
        BLM: "#c48b3a",
        FS: "#927c41",
        FWS: "#9d6b42",
        NPS: "#bc422a",
        DOD: "#f2d59a"
    }

var dataset, xScale, yScale, xAxis, yAxis, cScale;  // empty
}

//loading data 
d3.csv("units/wild-units.csv")
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
            0,
            d3.max(data, function(d){ 
                return Math.sqrt(parseInt(d["Total_acres"].split(",").join("")));
            })
        ])
        .range([h - padding, padding])

    
    var rScale = d3.scaleLinear()
        .domain([
        //     d3.min(data, function(d){
        //         return parseInt(d["Total_acres"].split(",").join(""));
        //     })
            0
            ,
            d3.max(data, function(d){
                return parseInt(d["Total_acres"].split(",").join(""));
            })
        ])
        .range([1,100]);
       
        
    //define X axis
    xAxis = d3.axisBottom()
                      .scale(xScale)
                      .ticks(48) //45 values in array

    //define Y axis
    yAxis = d3.axisLeft()
                      .scale(yScale)
                      .ticks(36);
                      

    //create SVG element
    var svg = d3.select("#units-plot")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
    

    //create circles
    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", function(d, i) {
        // console.log(parseInt(d["year"]))
            // return xScale(parseInt(d["year"]));
            if (i%2) {
                return xScale(parseInt(d["year"]))
            }else{
                return xScale(parseInt(d["year"]))+4
            }
       })
       .attr("cy", function(d, i) { //WHY ADD i HERE?
            return yScale(Math.sqrt(d["Total_acres"].split(",").join("")));
       })
       .attr("r", function(d){
        // console.log([d["acres-designated"], rScale(d["acres-designated"])])
        // return 5
            return rScale(d["Total_acres"].split(",").join(""))
        })
    

    // circle colors
       .style("fill", function(d){
            return colorDictionary[d.Agency]
       })
    //    .style("opacity", .75)

});