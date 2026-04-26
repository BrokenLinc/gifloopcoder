function onGLC(glc) {
	glc.loop();
    glc.styles.backgroundColor = "black";
    glc.setMode("single"); // "bounce" | "single"
    glc.styles.strokeStyle = "rgba(0,255,255,100)";
    glc.styles.fillStyle = "cyan";
    glc.styles.lineWidth = 2;
    glc.setEasing(false);

	var list = glc.renderList,
		width = glc.w,
		height = glc.h;

    for(var i=0; i<11; i++){
        for(var j=0; j<11; j++){
            var cw = Math.random() > 0.5;
            // list.addCircle({
            //     x:i*40,
            //     y:j*40,
            //     radius:20,
            //     fill:false,
            //     stroke:true,
            //     startAngle:cw? [0, 359] : [359, 0],
            //     endAngle:cw? [180, 539] : [539, 180],
            //     phase: Math.floor(Math.random()*4)/4
            // });
            list.addArcSegment({
                x:i*40,
                y:j*40,
                radius:20,
                fill:false,
                stroke:true,
                startAngle:cw? [0, 359] : [359, 0],
                endAngle:cw? [180, 539] : [539, 180],
                phase: Math.floor(Math.random()*4)/4
            });
            // list.addRect({
            //     x:i*40 + 20,
            //     y:j*40 + 20,
            //     w:12,
            //     h:12,
            //     rotation: 45,
            //     radius:4,
            //     fillStyle: "#666"
            // });
        }
    }

}