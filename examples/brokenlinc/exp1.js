function onGLC(glc) {
	glc.loop(); // glc.loop() | glc.playOnce()
	//glc.size(600, 150);
	// glc.setDuration(5);
	// glc.setFPS(20);
	//glc.setMode("single"); // "bounce" | "single"
	//glc.setEasing(false);
	var list = glc.renderList,
		width = glc.w,
		height = glc.h;

	var size = 400;
    var phase = 0;

    list.addRect({
        x:200,
        y:200,
        w:400,
        h:400,
        fillStyle: ["red", "magenta"]
    })

    for(var i=0; i<10; i++) {
        for(var j=0; j<10; j++) {
            list.addCube({
                x: i*50,
                y: j*50,
                size: 30,
                rotationX:[0,90],
                rotationY:[90, 0],
                rotationZ:[0,90],
                phase: (i+j) * 0.03,
                strokeStyle: ["yellow", "cyan"],
                lineWidth: 2
            });
        }
    }



}		