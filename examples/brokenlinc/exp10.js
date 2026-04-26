function onGLC(glc) {
	glc.loop();
    glc.styles.backgroundColor = "black";
    glc.setMode("single"); // "bounce" | "single"
    glc.styles.strokeStyle = "rgba(0,255,255,100)";
    glc.styles.fillStyle = "cyan";
    glc.styles.lineWidth = 1;
    glc.setEasing(false);
    glc.setDuration(1);
    glc.setFPS(50);

	var list = glc.renderList,
		width = glc.w,
		height = glc.h;

    var hexmult = 0.3;

    for(var i=0; i<16; i++){
        for(var j=0; j<46; j++){
            var x = (156*i + 78*(j%2))*hexmult;
            var y = 44*j*hexmult;
            list.addPoly({
                x:x,
                y:y,
                sides: 6,
                radius: 50*hexmult *0.66,
                phase: 2 + (Math.sin(x/130)+Math.sin(y/130))/2,
                //fill: false,
                //stroke: true,
                //strokeStyle: ["black", "cyan"],
                //fillStyle: ["red","orange","yellow","lime","green","cyan","blue","purple","magenta"],
                fillStyle: function(t) {
                    return "hsl("+(t*360)+",100%,50%)";
                }
                //radius:[0, 50*hexmult],
            });
        }
    }

}