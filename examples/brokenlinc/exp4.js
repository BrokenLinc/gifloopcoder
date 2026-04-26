function onGLC(glc) {
	glc.loop();
    glc.styles.backgroundColor = "red";
    glc.setMode("single"); // "bounce" | "single"
    glc.setEasing(false);

	var list = glc.renderList,
		width = glc.w,
		height = glc.h;

        for(var i=0; i<50; i++){
            list.addCube({
                rotationX:[0,90],
                rotationY:[0,90],
                rotationZ:[0,90],
                phase: i*0.01,
                size:200,
                x:200,
                y:200
            });
        }
}