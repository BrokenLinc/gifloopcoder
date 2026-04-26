function onGLC(glc) {
	glc.loop();
	// glc.size(400, 400);
	glc.setDuration(1.5);
	glc.setFPS(30);
	// glc.setMode("single"); //single|bounce
	// glc.setEasing(false);
	glc.setMaxColors(24);
    glc.styles.backgroundColor = "rgb(250,215,130)";
	var list = glc.renderList,
		width = glc.w,
		height = glc.h,
		color = glc.color;

	// your code goes here:

	var gradient = color.createLinearGradient(0,-height/2,0,height/2);
	gradient.addColorStop(0, "rgb(250,215,130)");
	gradient.addColorStop(0.5, "rgb(202,150,82)");
	gradient.addColorStop(1, "rgb(250,215,130)");

	list.addRect({
		fillStyle: gradient,
		x:width/2,
		y:height/2,
		w:width,
		h:height
	})

	for(var i=0;i<250;i++) {
		list.addOval({
			x: width/2,
			y: [height/2-5, height/2+5],
			rx: 3*i,
			ry: i,
			fill: false,
			stroke: true,
			strokeStyle: "rgba(252,235,192,"+(150-i)/150+")",
			lineWidth: 1,
			phase: -i/40,
			blendMode: "overlay"
		});
	}

}