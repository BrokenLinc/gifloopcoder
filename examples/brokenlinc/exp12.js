function onGLC(glc) {
	glc.loop();
	// glc.size(400, 400);
	glc.setDuration(0.5);
	glc.setFPS(22);
	// glc.setMode("single"); //single|bounce
	// glc.setEasing(false);
	glc.setMaxColors(24);
    glc.styles.backgroundColor = "red";
	var list = glc.renderList,
		width = glc.w,
		height = glc.h,
		color = glc.color;

	list.addOval({
		fillStyle:"white",
		x:width/2,
		y:height/2,
		rx:width*0.3825,
		ry:width*0.3825
	});

	(function stump() {
		var basey = 170;
		var gradient = color.createLinearGradient(-10,0,10,0);
		gradient.addColorStop(0, "#951");
		gradient.addColorStop(1, "#630");

		list.addRect({
			fillStyle:gradient,
			x: width/2,
			y: [basey+95, basey+105],
			phase: 8/30,
			w:20,
			h:50
		});
	})();

	for(var i=7;i>=0;i--) {
		var basey = Math.pow(i,1.2)*12;
		var gradient = color.createLinearGradient(-i*5,0,i*3,0);
		gradient.addColorStop(0, "#33aa33");
		gradient.addColorStop(1, "#118811");

		list.addPoly({
			sides:3,
			fillStyle:gradient,
			rotation: -90,
			x: width/2,
			y: [basey+95, basey+105],
			radius: i*10,
			phase: i/30
		});
	}

	dots(120, 0);
	dots(140, 0.2);
	dots(170, 0.4);

	function dots(radius, phase) {
		for(var i=0;i<360;i+=10) {
			var x = width/2 + Math.cos(Math.PI/180 * i)*radius;
			var y = height/2 + Math.sin(Math.PI/180 * i)*radius;
			var x2 = width/2 + Math.cos(Math.PI/180 * (i+5))*radius;
			var y2 = height/2 + Math.sin(Math.PI/180 * (i+5))*radius;

			list.addCircle({
				radius:2,
				fillStyle:"black",
				x: [x, x2],
				y: [y, y2],
				phase: phase
			});
		}
	}

	function addBubble(){

        var x = Math.random();
        var y = Math.random();
        var tp = Math.random();

        list.addCircle({
            y:function(t){
                return x*width + Math.cos(10*(t+tp) * Math.PI)*t*6;
            },
            x:function(t){
                return t*height;
            },
            radius:2,
            fillStyle: "white",
            phase:Math.random()
        });

    }

}		