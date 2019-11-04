
var canvas = document.getElementsByTagName("canvas");
var myLegend = document.getElementById("myLegend");
function drawLine(ctx, startX, startY, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}
function drawArc(ctx, centerX, centerY, radius, startAngle, endAngle)   {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.stroke();
}
function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
}

var Piechart = function(options) {
    this.options = options;
    this.canvas = options.canvas;
    this.color = options.colors;

    this.draw = function() {
        
        for (var i = 0; i < this.options.data[0]["machine"].length; i ++) 
        { 
            var total_value = 0;
            var color_index = 0;
            this.options.data[0]["machine"][0]["data"]["curing"] = curing;
            this.options.data[0]["machine"][1]["data"]["curing"] = curing1;
            this.options.data[0]["machine"][2]["data"]["curing"] = curing2;
            this.options.data[0]["machine"][3]["data"]["curing"] = curing3;
            this.options.data[0]["machine"][4]["data"]["curing"] = curing4;
            for (var categ in this.options.data[0]["machine"][i]["data"]) {
                var val = this.options.data[0]["machine"][i]["data"][categ];
                total_value += val;
            }
          
            ctx = canvas[i].getContext('2d');
            var start_angle = 0;
            for (categ in this.options.data[0]["machine"][i]["data"]) 
            {
                val = this.options.data[0]["machine"][i]["data"][categ];
                var slice_angle = 2 * Math.PI * val / total_value;

                var pieRadius = Math.min(this.canvas[i].width/2,this.canvas[i].height/2);
                var labelX = this.canvas[i].width/2 + (pieRadius / 2) * Math.cos(start_angle + slice_angle/2);
                var labelY = this.canvas[i].height/2 + (pieRadius / 2) * Math.sin(start_angle + slice_angle/2);
                if (this.options.doughnutHoleSize) {
                    var offset = (pieRadius * this.options.doughnutHoleSize ) / 2;
                    labelX = this.canvas[i].width/2 + (offset + pieRadius / 2) * Math.cos(start_angle + slice_angle/2);
                    labelY = this.canvas[i].height/2 + (offset + pieRadius / 2) * Math.sin(start_angle + slice_angle/2);               
                }
                drawPieSlice(
                    ctx, 
                    canvas[i].width/2, 
                    canvas[i].height/2,
                    Math.min(canvas[i].width/2, canvas[i].height/2),
                    start_angle,
                    start_angle + slice_angle,
                    this.color[color_index % this.color.length]
                );
                var labelText = Math.round(100 * val / total_value);
                ctx.fillStyle = "white";
                ctx.font = "bold 20px Arial";
                ctx.fillText(labelText+"%", labelX,labelY);

                start_angle += slice_angle;
                color_index++;
            }
            if (this.options.doughnutHoleSize){
                drawPieSlice(
                    ctx,
                    canvas[i].width/2,
                    canvas[i].height/2,
                    this.options.doughnutHoleSize * Math.min(canvas[i].width/2,canvas[i].height/2),
                    0,
                    2 * Math.PI,
                    "#ffffff"
                );
            }
            if (this.options.legend){
                color_index = 0;
                var legendHTML = "";
                for (categ in this.options.data[0]["machine"][i]["data"]){
                    legendHTML += "<div><span style='display:inline-block;width:20px;background-color:"+ this.color[color_index++]+";'>&nbsp;</span> "+categ+"</div>";
                }
                this.options.legend.innerHTML = legendHTML;
            }
        }
    }
}
var curing = 0;
var curing1 = 5;
var curing2 = 1;
var curing3 = 3;
var curing4 = 2;
var D01 = {
    "Curing": curing,
    "Mold Washing": 30,
    "Break Time": 5,
    "Other": 12
}
var listData = [
	{
		"line" : "571",
		"machine" : [
			{
                "name": "D01",
                "data" : {
                    "curing": curing,
                    "washing": 10,
                    "breaktime": 5,
                    "other": 10
                }
			},
			{
                "name": "D02",
                "data" : {
                    "curing": curing1,
                    "washing": 150,
                    "breaktime": 653,
                    "other": 10
                }
			},
			{
                "name": "D03",
                "data" : {
                    "curing": curing2,
                    "washing": 150,
                    "breaktime": 53,
                    "other": 10
                }
            },
            {
                "name": "D04",
                "data" : {
                    "curing": curing3,
                    "washing": 120,
                    "breaktime": 53,
                    "other": 10
                }
            },
            {
                "name": "D05",
                "data" : {
                    "curing": curing4,
                    "washing": 110,
                    "breaktime": 50,
                    "other": 10
                }
            }
		]
	},
	{
		"line" : "572",
		"machine" : [
			{
				"name": "D01",
				"data" : {
                    "curing": 35,
                    "washing": 410,
                    "breaktime": 55
                }
			},
			{
				"name": "D02",
				"curing": 34,
				"washing": 1502,
				"breaktime": 53
			},
			{
				"name": "D03",
				"curing": 42,
				"washing": 1540,
				"breaktime": 153
			}
		]
	},
	{
		"line" : "573",
		"machine" : [
			{
				"name": "D01",
				"curing": 54,
				"washing": 10,
				"breaktime": 5
			},
			{
				"name": "D02",
				"curing": 34,
				"washing": 150,
				"breaktime": 53
			},
			{
				"name": "D03",
				"curing": 34,
				"washing": 1350,
				"breaktime": 543
			}
		]
	}
]

var myPiechart = new Piechart(
    {
        canvas: canvas,
        data: listData,
        colors: ["#fde23e","#f16e23", "#57d9ff","#937e88"],
        doughnutHoleSize:0.5,
        legend:myLegend
    }
);
//myPiechart.draw();
setInterval(() => {
    curing += 1;
    curing1 += 1;
    curing2 += 1;
    curing3 += 1;
    curing4 += 1;
    myPiechart.draw();
}, 5000);



