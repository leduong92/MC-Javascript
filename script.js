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

var curingCheck = 0;
var Piechart = function(options) {
    this.options = options;
    this.canvas = options.canvas;
    this.color = options.colors;

    this.draw = function() {
        //console.log(curing);
        //console.log(curingCheck);
        for (var i = 0; i < this.options.data[0]["machine"].length; i ++) 
        { 
            var total_value = 24;
            var color_index = 0;

            if (curing > curingCheck)
            {
                this.options.data[0]["machine"][0]["data"]["curing"] = curing;
            }
                
            curingCheck = this.options.data[0]["machine"][0]["data"]["curing"];
      
            // for (var categ in this.options.data[0]["machine"][i]["data"]) {
            //     var val = this.options.data[0]["machine"][i]["data"][categ];
            //     total_value += val;
            // }
            
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
                    legendHTML += "<div><span style='display:inline-block;width:20px;background-color:"+ this.color[color_index++] +";'>&nbsp;</span> "+categ+"</div>";
                }
                this.options.legend.innerHTML = legendHTML;
            }
        }
    }
}
var curing = 1;
var washing = 5;
var breaktime = 3;
var other = 9;

var listData = [
	{
		"line" : "571",
		"machine" : [
			{
                "name": "D01",
                "data" : {
                    "curing": curing,
                    "washing": washing,
                    "breaktime": breaktime,
                    "other": other
                }
			},
			{
                "name": "D02",
                "data" : {
                    "curing": 22,
                    "washing": 150,
                    "breaktime": 653,
                    "other": 10
                }
			},
			{
                "name": "D03",
                "data" : {
                    "curing": 44,
                    "washing": 150,
                    "breaktime": 53,
                    "other": 10
                }
            },
            {
                "name": "D04",
                "data" : {
                    "curing": 33,
                    "washing": 120,
                    "breaktime": 53,
                    "other": 10
                }
            },
            {
                "name": "D05",
                "data" : {
                    "curing": 21,
                    "washing": 110,
                    "breaktime": 50,
                    "other": 10
                }
            }
		]
	},
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
    myPiechart.draw();
}, 5000);

