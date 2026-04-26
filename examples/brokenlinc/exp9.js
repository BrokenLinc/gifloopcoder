function onGLC(glc) {
	glc.loop();
    glc.styles.backgroundColor = "rgb(84,17,2)";
    glc.setMode("single");
    glc.styles.lineWidth = 1;
    glc.setEasing(false);
    glc.setDuration(1);
    glc.setFPS(50);

	var list = glc.renderList,
		w = glc.w,
		h = glc.h;

        for(var i=0; i<400; i++) {
            addBubble();
        }

        function addBubble(){

            var x = Math.floor(Math.random()*10)/10;
            var y = Math.random();
            var tp = Math.random();

            list.addCircle({
                x:function(t){
                    return x*w + Math.cos(10*(t+tp) * Math.PI)*t*6;
                },
                y:function(t){
                    return h - (t*t*h);
                },
                radius:[0,2],
                strokeStyle: "rgba(196,91,43,0.6)",
                //strokeStyle:["white","rgba(255,255,255,0)"],
                phase:Math.random(),
                stroke:true,
                fill:false
            });

        }
}