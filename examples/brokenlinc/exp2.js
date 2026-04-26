function onGLC(glc) {
	glc.loop(); // glc.loop() | glc.playOnce()
	//glc.size(600, 150);
	// glc.setDuration(5);
	// glc.setFPS(20);
	//glc.setMode("single"); // "bounce" | "single"
	//glc.setEasing(false);
        
    glc.styles.lineWidth = 7;
    glc.styles.backgroundColor = "white";

	var list = glc.renderList,
		width = glc.w,
		height = glc.h;

	var size = 400;
    var phase = 0;

    // list.addRect({
    //     x:200,
    //     y:200,
    //     w:400,
    //     h:400,
    //     fillStyle: "red"
    // })


    var num = 150;

    for(var i = 0; i < num; i++) {
        list.addArcSegment({
            radius: i*1,
            rotation: [-720+90, 720+90],
            arc: 1,
            strokeStyle: "hsl("+(360*i/num)+", 100%, 50%)",
            x: 200,
            y: 200,
            phase: 1.0/num*i/2
        });
    }



}		