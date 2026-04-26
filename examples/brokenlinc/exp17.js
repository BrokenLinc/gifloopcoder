function onGLC(glc) {
    glc.loop();
    // glc.size(400, 400);
    glc.setDuration(6);
    // glc.setFPS(20);
    // glc.setMode("single");
    //glc.setEasing(false);
    glc.setMaxColors(6);
    glc.styles.backgroundColor = "#111";
    var list = glc.renderList,
        w = glc.w,
        h = glc.h,
        color = glc.color;

    // your code goes here:

    for(var i=0;i<40;i++) {
        list.addRect({
            w:100,
            h:2,
            x:[25,400 - 25],
            y:i*10,
            phase: i * 0.01,
            fillStyle:"cyan"
        });
    }
    for(var i=0;i<40;i++) {
        list.addRect({
            w:100,
            h:2,
            x:[25,400 - 25],
            y:i*10 + 2,
            phase: i * 0.02,
            fillStyle:"yellow"
        });
    }
    for(var i=0;i<40;i++) {
        list.addRect({
            w:100,
            h:2,
            x:[25,400 - 25],
            y:i*10 + 4,
            phase: 0.5+i * 0.03,
            fillStyle:"magenta"
        });
    }

}