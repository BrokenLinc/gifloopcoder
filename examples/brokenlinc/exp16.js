function onGLC(glc) {
    glc.loop();
    // glc.size(400, 400);
    //glc.setDuration(10);
    // glc.setFPS(20);
    //glc.setMode("single");
    //glc.setEasing(false);
    // glc.setMaxColors(256);
    glc.styles.backgroundColor = "black";
    var list = glc.renderList,
        w = glc.w,
        h = glc.h,
        color = glc.color;

    // your code goes here:

    for(var i=0; i<=1; i+=0.05) {
        for(var j=0; j<=1; j+=0.05) {
            list.addCircle({
                x: [i*w,w/2 + Math.cos((i+0.25 + j*0.5) * 2 * Math.PI) * j * w/2],
                y: [j*h,h/2 + Math.sin((i+0.25 + j*0.5) * 2 * Math.PI) * j * h/2],
                radius:3,
                phase: i+j,
                blendMode:"screen",
                fillStyle:"rgba(255,"+Math.round(i*255)+","+Math.round(j*255)+",1)"
            });
        }   
    }

}