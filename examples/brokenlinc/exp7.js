function onGLC(glc) {
	glc.loop();
    glc.styles.backgroundColor = "black";
    glc.setMode("single"); // "bounce" | "single"
    glc.styles.strokeStyle = "rgba(0,255,255,100)";
    glc.styles.fillStyle = "cyan";
    glc.styles.lineWidth = 2;
    glc.setEasing(false);

	var list = glc.renderList,
		w = glc.w,
		h = glc.h;

    for(var e=-180; e<=180; e+=10){
        for(var r=0; r<360; r+=10){
            list.addCircle({
                x: [
                    w/2 + 180*spherex(e,r),
                    w/2 + 180*spherex(e,r+10)
                ],
                y: h/2 + 180*spherey(e,r),
                radius:1
            });
        }
    }

    function spherex(e,r) {
        return Math.cos(r * Math.PI/180)*Math.cos(e * Math.PI/180);
    }
    function spherey(e,r) {
        return Math.sin(e * Math.PI/180);
    }

}