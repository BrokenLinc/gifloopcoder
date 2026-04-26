function onGLC(glc) {
    glc.setDuration(5);
    glc.loop();
    var list = glc.renderList,
        width = glc.w,
        height = glc.h,
        color = glc.color;

    var pentagon = list.addPoly({
        x: width/2,
        y: height/2,
        rotation: [0, 180]
    });
    list.addRect({
        fillStyle: "red",
        attachTo: pentagon,
        //y:[100, -100],
        //x:0,
        rotation: [45, 90]
    });

}