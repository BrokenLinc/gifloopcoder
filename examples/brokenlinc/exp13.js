function onGLC(glc) {
	glc.loop();
	// glc.size(400, 400);
	glc.setDuration(2);
	glc.setFPS(30);
	glc.setMode("single"); //single|bounce
	glc.setEasing(false);
	glc.setMaxColors(48);
    glc.styles.backgroundColor = "black";
	var list = glc.renderList,
		width = glc.w,
		height = glc.h,
		color = glc.color;

	// your code goes here:

	for(var i=7;i>=3;i--) {
		snowballs(i, 3/i, Math.pow(10-i,1.7)*15 -270);
	}

	// snowballs(5, 4/5, -100);
	// snowballs(4, 1, 0);
	// snowballs(3, 4/3, 150);

	function snowballs(num, size, y) {
		list.addRect({
			//fillStyle: "rgba(190,170,210,0.2)",
			fillStyle: "#dce",
			w: width,
			h: 60 * size,
			x: width/2,
			y: height/2 + 40*size + y
		});
		list.addRect({
			//fillStyle: "rgba(190,170,210,0.2)",
			fillStyle: "#bac",
			w: width,
			h: 10 * size,
			x: width/2,
			y: height/2 + 65*size + y
		});

	    var snowBallGradient = color.createRadialGradient(10*size, -10*size, 20*size, 50*size, -50*size, 110*size);
	    snowBallGradient.addColorStop(0, "white");
	    snowBallGradient.addColorStop(1, "#cbd");

		for(var i=-1;i<num;i++) {
			var xbase = i/(num-1)*width;
			var xbase2 = (i+1)/(num-1)*width;
			list.addOval({
				rx:50 * size,
				ry:20 * size,
				y:height/2 + 35*size + y,
				x:[xbase - 20*size, xbase2 - 20*size],
				fillStyle: "rgba(190,170,210,0.8)"
			});
			list.addOval({
				rx:50 * size,
				ry:50 * size,
				y:height/2 + y,
				x:[xbase, xbase2],
				fillStyle: snowBallGradient
			});
		}
	}

}