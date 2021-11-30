{
    var w = 200
    var h = 200
    var margin = 20
    var radius = Math.min(w, h) / 2 - margin
        
    // loading data from two files 
    var dataset1 = d3.csv("states/agency-per-state.csv")
    var dataset2 = d3.csv("states/wild-per-state.csv")
}
        
Promise.all([dataset1,dataset2])

.then(function(data){
    console.log(data[0])
    console.log(data[1])

for(var i = 0; i<data[0].length; i++){
        var svg = d3.select("#donuts").append("svg").attr("width",w).attr("height",h)


var colors1 = [
    "#c48b3a",  //BLM
    "#927c41",  //FS
    "#9d6b42",  //FWS
    "#bc422a",  //NPS
    "#f2d59a",  //DOD
    "#000000"    //other
]
var colors2 = ["#000000", "#eeeeee"] 

pieChart(data[0][i],"outer",62,radius,svg,colors1,200)
pieChart(data[1][i],"inner",45,60,svg,colors2,200)

// console.log(data[0][i]["State"])
// console.log(data[1][i]["State"])

svg.append("text")
    .text(data[0][i]["State"])
    .attr("x", w/2)
    .attr("y", h/2)
    .attr("text-anchor", "middle")
    .attr("font-size", ".75em")
    .attr("font-style", "italic")


}      
    })


    function pieChart(data,className,inner,outer,svg,colors,x){
            //  console.log(data)  
        var pie = d3.pie();
        var arc = d3.arc().innerRadius(inner).outerRadius(outer)
      
        var array = []
        for(var d in data){
            // console.log(d,data[d])
			//statement to filter out column headings
			if(d!="State"){
            	array.push(data[d])
			}
        }
		
        var arcs = svg.selectAll("g.arc") //WHAT IS g.arc?
                .data(pie(array))
                .enter()
                .append("g")
                .attr("class",className)
                .attr("transform", "translate(" + x/2+ "," + h/2 + ")")
                .append("path")
                .attr("fill", function(d, i) {
                    return colors[i];
                })
                // .attr("stroke","#ffffff")
                // .attr("stroke-width",2)
                .attr("d", arc);
                
        }