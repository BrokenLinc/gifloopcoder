function onGLC(glc) {
	glc.loop();
    glc.styles.backgroundColor = "white";
    glc.setMode("single"); // "bounce" | "single"
    glc.setEasing(false);

	var list = glc.renderList,
		width = glc.w,
		height = glc.h;

        for(var i=0; i<50; i++){
            list.addCircle({
                startAngle:[0,360],
                endAngle:[180, 540],
                //strokeStyle:"black",
                lineWidth:1,
                stroke:true,
                fill: false,
                radius: i*6,
                x:200,
                y:200,
                phase: i/30,
                strokeStyle: "hsl("+(360*i/50)+", 100%, 50%)",
            });
            list.addCircle({
                startAngle:[360,0],
                endAngle:[540,180],
                //strokeStyle:"black",
                lineWidth:1,
                stroke:true,
                fill: false,
                radius: i*6 + 3,
                x:200,
                y:200,
                phase: i/30,
                strokeStyle: "#666",
            });
        }
}