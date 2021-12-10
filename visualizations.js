Promise.all([
    d3.csv("chronology/wild-per-year.csv"),    //0
    d3.csv("units/wild-units-new.csv"),   //1
    d3.csv("states/agency-per-state.csv"), //2
    d3.csv("states/wild-per-state.csv"),   //3
    d3.csv("introduction/fed-total.csv")         //4
    ])
        .then(function(data){
            drawChronology(data[0])
            drawUnits(data[1])
            drawStates()
            // drawBar1(data[4])
        });



    
///// CHRONOLOGY SCATTERPLOT
function drawChronology(data){

        // chart width and height
		var w = 1200;
		var h = 600;
		var padding = 80;
			
		var dataset, xScale, yScale, xAxis, yAxis;  // empty

		// console.log(data);

        xScale = d3.scaleLinear()
            .domain([
                d3.min(data, function(d){
                    return parseInt(d["year"] - 1);
                }),
                d3.max(data, function(d){
                    return parseInt(d["year"]);
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
            .range([2,100]);
                   
                    
        //define X axis
		xAxis = d3.axisBottom()
			.scale(xScale)
			.ticks(30) //45 values in array
            .tickFormat(d3.format("d"))

		//define Y axis
		yAxis = d3.axisLeft()
			.scale(yScale)
			.ticks(30);
                                  

		//create SVG element
		var svg = d3.select("#chronology-plot")
			.append("svg")
			.attr("width", w)
			.attr("height", h)        
                    

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
                //console.log(d)
                    if(d.party== "Democratic"){
                        return "blue"
                    }else{
                        return "red"
                    }
                })
                .style("cursor", "pointer")

                //show tooltip
                .on("mouseover", function(d){

                var xPosition = parseFloat(d3.select(this).attr("cx"));
                var yPosition = parseFloat(d3.select(this).attr("cy"));
                        
                d3.select("#tooltipChronology")
                    .style("left", xPosition + "px")
                    .style("top", yPosition + "px")
                    .select("#year")
                    .text(d.year) 
                d3.select("#tooltipChronology")
                    .select("#laws")
                    .text(d.legislation);
                })

                //hide tooltip
                .on("mouseout",function(d,i){
				   d3.select("#tooltipChronology").classed("hidden", true);
                })                
            
                //create x axis
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (h - padding) + ")")
                    .call(xAxis);
			
			    //create Y axis
			    svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + padding + ",0)")
                    .call(yAxis);

            };




///// UNITS SCATTERPLOT
function drawUnits(data){

// chart width and height
var w = 1200;
var h = 600;
var padding = 80;

var colorDictionary = {
        BLM: "#c48b3a",
        FS: "#927c41",
        FWS: "#9d6b42",
        NPS: "#bc422a",
        DOD: "#f2d59a"
    }

var dataset, xScale, yScale, xAxis, yAxis, cScale;  // empty

    xScale = d3.scaleLinear()
        .domain([
            d3.min(data, function(d){
                return parseFloat(d["year"]) - 1;
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
                return Math.sqrt(parseInt(d["Unit_acres"].split(",").join("")));
            })
        ])
        .range([h - padding, padding])

    
    var rScale = d3.scaleLinear()
        .domain([
        //     d3.min(data, function(d){
        //         return parseInt(d["Unit_acres"].split(",").join(""));
        //     })
            0
            ,
            d3.max(data, function(d){
                return parseInt(d["Unit_acres"].split(",").join(""));
            })
        ])
        .range([2,80]);
       
        
    //define X axis
    xAxis = d3.axisBottom()
                      .scale(xScale)
                      .ticks(30) //45 values in array
                      .tickFormat(d3.format("d"))

    //define Y axis
    yAxis = d3.axisLeft()
                      .scale(yScale)
                      .ticks(30);
                      

    //create SVG element
    var svg = d3.select("#units-plot")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
    

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
                return xScale(parseInt(d["year"])) + 6
            }
       })
       .attr("cy", function(d, i) { 
            return yScale(Math.sqrt(d["Unit_acres"].split(",").join("")));
       })
       .attr("r", function(d){
        // console.log([d["acres-designated"], rScale(d["acres-designated"])])
        // return 5
            return rScale(d["Unit_acres"].split(",").join(""))
        })
        .style("cursor", "pointer")


        // circle colors
       .style("fill", function(d){
            return colorDictionary[d.Agency]
       })
       .style("opacity", .75)


        //show tooltip
        .on("mouseover", function(d){

            var xPosition = parseFloat(d3.select(this).attr("cx"));
            var yPosition = parseFloat(d3.select(this).attr("cy"));
            d3.select("#tooltipUnits")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px")
                .select("#year")
                .text(d.year) 
            d3.select("#name")
                .text(d.Name)
            d3.select("#size")
                .text(d.Unit_acres);
        })

        //hide tooltip
        .on("mouseout",function(d,i){
           d3.select(this).attr("fill","black")
           d3.select("#tooltipUnits").classed("hidden", true);
        })


    //create x axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    //create Y axis <-- MESSED UP BECAUSE xScale SQRT 
    // svg.append("g")
    //     .attr("class", "axis")
    //     .attr("transform", "translate(" + padding + ",0)")
    //     .call(yAxis);

};



///// STATE DONUTS
function drawStates(data){

    var w = 200
    var h = 200
    var margin = 20
    var radius = Math.min(w, h) / 2 - margin
    
    // loading data from two files 
    var dataset1 = d3.csv("states/agency-per-state.csv")
    var dataset2 = d3.csv("states/wild-per-state.csv")
    
Promise.all([dataset1,dataset2])

.then(function(data){
    console.log(data[0])
    console.log(data[1])

    for(var i = 0; i<data[0].length; i++){
        var svg = d3.select("#state-donuts").append("svg").attr("width",w).attr("height",h)

    var colors1 = [
        "#c48b3a",  //BLM
        "#927c41",  //FS
        "#9d6b42",  //FWS
        "#bc422a",  //NPS
        "#f2d59a",  //DOD
        "#000000"   //other
    ]
    var colors2 = ["#D4D4D4", "#000000"] 

    pieChart(data[0][i],"outer",60,radius,svg,colors1,200)
    pieChart(data[1][i],"inner",40,58,svg,colors2,200)

    // console.log(data[0][i]["State"])
    // console.log(data[1][i]["State"])

    svg.append("text")
        .text(data[0][i]["State"])
        .attr("x", w/2)
        .attr("y", h/2)
        .attr("text-anchor", "middle")
    // ADD OVERFLOW FOR LONGER NAMES?
    
    // ADD TOTAL ACREAGE OF STATE TOO  
    // svg.append("text")
    //     .text(data[1][i]["wilderness_acres"+"non-wilderness"])
    //     .attr("x", w/2)
    //     .attr("y", (h/2) + 15)
    //     .attr("text-anchor", "middle")
    //     .style("font-size", ".75em")
    
    }
    
})


function pieChart(data,className,inner,outer,svg,colors,x){
    //  console.log(data)  
    var pie = d3.pie();
    var arc = d3.arc().innerRadius(inner).outerRadius(outer)
  
    var array = []

    // statement to filter out column headings
    var labels=[]
    for(var d in data){
        if(d!="State"){
            labels.push(d)
            array.push(data[d])
        }
        }
    
    //.log(data)
    // create arcs
    var arcs = svg.selectAll("g.arc")
        .data(pie(array))
        .enter()
        .append("g")
        .attr("transform", "translate(" + x/2+ "," + h/2 + ")")
        .append("path")
        .attr("fill", function(d, i) {
                return colors[i];
        })
        .attr("d", arc)

        .on("mouseover", function(d,i) {
            console.log(d,i)
            d3.select("#agency-name").html(labels[i])
            d3.select("#acreage").html(d.data)
            d3.select(this)
                .attr("stroke", "#ffffff")
                .attr("stroke-width", 2)
            d3.select("#tooltipStates")
            .style("position","fixed")
            .style("left",event.clientX+"px")
            .style("top",event.clientY+"px")
        })

        .on("mouseout", function(d,i) {
            d3.select(this)
            .attr("stroke-width", 0);
            d3.select("#tooltipStates")
                .classed("hidden", true);        
        })

}
}




// ///// BAR-TOTAL 
// function drawBar1(data){

//     // chart width and height
//     var w = 1000;
//     var h = 300;
//     var barPadding = 5
//     var margin = 200
//     var xMargin = 40
    
//     var dataset; 
    
//     var colors = [
//     "#d4d4d4",	//non-federal
//     "#c48b3a",  //BLM
//     "#927c41",  //FS
//     "#9d6b42",  //FWS
//     "#bc422a",  //NPS
//     "#f2d59a",  //DOD
//     "#000000"   //other
//     ]
    
//     var xScale = d3.scaleLinear().domain([
//         0
//         ,
//         d3.max(dataset, function(d){return parseInt(d.TotalAcres);})
//         ])
//         .range([0,w])
    
//     var xAxis = d3.axisBottom()
//         .scale(xScale)
//         .ticks(10)
    
//     // SVG element
//     var svg = d3.select("#bar-total")
//                 .append("svg")
//                 .attr("width", w)
//                 .attr("height", h+xMargin);
    
//     // create bars			
//     svg.selectAll("rect")
//        .data(dataset)
//        .enter()
//        .append("rect")
//        .attr("y", function(d, i) {
//            return i * (h / dataset.length)
//        })
//        .attr("x", function(d) {
//                return 0 + margin
//        })
//        .attr("height", h / dataset.length - barPadding)
//        .attr("width", function(d) {
//                return xScale(d.TotalAcres)
//        })
//        .attr("fill", function(d, i){
//            return colors[i]
//        })
    
//     svg.selectAll("labels")
//        .data(dataset)
//        .enter()
//        .append("text")
//        .text(function(d){
//            return d.Agency;
//        })
//        .attr("y", function(d, i) {
//            return (i * (h / dataset.length)) +28 // HOW DO I CENTER TEXT IN MIDDLE OF BAR?
//        })
//         .attr("x", margin - 10)
//            .attr("text-anchor", "end")
    
//     // xAXIS 
//     svg.append("g")
//        .attr("class", "axis")
//        .attr("transform", "translate(" + margin +"," + h + ")")			   
//        .call(xAxis)
    
//     };




// ///// BAR-WILD
// {
// var colors = [
//     "#c48b3a",  //BLM
//     "#927c41",  //FS
//     "#9d6b42",  //FWS
//     "#bc422a",  //NPS
//     "#f2d59a",  //DOD
//     ]

// var data_total = [
//     {agency: "Bureau of Land Management", acres: 244400000},
//     {agency: "Forest Service", acres: 192900000},
//     {agency: "Fish and Wildlife Service", acres: 89200000},
//     {agency: "National Park Service", acres: 79900000},
//     {agency: "Department of Defense", acres: 8800000}
// ];
    
// var data_wilderness = [
//     {agency: "Bureau of Land Management", acres: 9986645},
//     {agency: "Forest Service", acres: 36670166},
//     {agency: "Fish and Wildlife Service", acres: 20702709},
//     {agency: "National Park Service", acres: 44337407},
//     {agency: "Department of Defense", acres: 0}
// ];

// // set the dimensions and margins of the graph
// var margin = {top: 20, right: 60, bottom: 60, left: 60},
//     width = 800 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;


// // append the svg object to the body of the page
// var svg = d3.select("#bar-wild")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");

// // X axis
// var x = d3.scaleBand()
// .range([ 0, width ])
// .domain(data_total.map(function(d) { return d.agency; }))
// .padding(0.2);
// svg.append("g")
// .attr("transform", "translate(0," + height + ")")
// .call(d3.axisBottom(x))

// // Add Y axis
// var y = d3.scaleLinear()
//     .domain([0, 244400000])
//     .range([ height, 0]);
// svg.append("g")
//     .attr("class", "myYaxis")
//     .call(d3.axisLeft(y));

// // A function that create / update the plot for a given variable:
// function update(data) {

// var u = svg.selectAll("rect")
//     .data(data)

// u
//     .enter()
//     .append("rect")
//     .merge(u)
//     .transition()
//     .duration(1000)
//     .attr("x", function(d) { return x(d.agency); })
//     .attr("y", function(d) { return y(d.acres); })
//     .attr("width", width / 6)
//     .attr("height", function(d) { return height - y(d.acres); })
//     .attr("fill", function(d, i){
//            return colors[i]
//        })        
//     }

// // Initialize the plot with the first dataset
// update(data_total)

// }