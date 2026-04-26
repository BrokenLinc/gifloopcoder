function onGLC(glc) {
    glc.loop();
    // glc.size(400, 400);
    glc.setDuration(6);
    glc.setFPS(24);
    glc.setMode("single");
    glc.setEasing(false);
    glc.setMaxColors(6);
    var list = glc.renderList,
        w = glc.w,
        h = glc.h,
        color = glc.color;

    var numStripes = 27;
    for(var i=0;i<numStripes;i++) {
        list.addRect({
            x:[400,-140],
            y:[400,-140],
            fillStyle:"red",
            rotation:-45,
            w:600,
            h:[0,28],
            phase:i/numStripes
        });
    }

    var root = list.addRect({
        x:[0,-240 * 3],
        y:[0,-120 * 3],
        w:0,
        h:0
    });

    for(var i=0;i<7;i++) {
        for(var j=0;j<8;j++) {
            var x1 = 180*i +j%3*60 - 100;
            var y1 = 120*j - 120
            candyCane(x1,y1,root);
        }
    }

    function candyCane(x,y,parent) {

        var maskColor = "black";
        var root = list.addRect({
            x:x,
            y:y,
            w:0,
            h:0,
            attachTo:parent
        });

        list.addRect({
            x:0 + 140/2,
            y:0 + 20/2,
            w:140,
            h:20,
            fillStyle:maskColor,
            attachTo:root
        });
        list.addRect({
            x:0 + 20/2,
            y:0 + 260/2,
            w:20,
            h:260,
            fillStyle:maskColor,
            attachTo:root
        });
        list.addRect({
            x:120 + 20/2,
            y:0 + 140/2,
            w:20,
            h:140,
            fillStyle:maskColor,
            attachTo:root
        });
        list.addRect({
            x:0 + 80/2,
            y:240 + 20/2,
            w:80,
            h:20,
            fillStyle:maskColor,
            attachTo:root
        });
        list.addRect({
            x:60 + 80/2,
            y:120 + 20/2,
            w:80,
            h:20,
            fillStyle:maskColor,
            attachTo:root
        });
        list.addRect({
            x:60 + 20/2,
            y:70 + 190/2,
            w:20,
            h:190,
            fillStyle:maskColor,
            attachTo:root
        });
        list.addCircle({
            x:60 + 10,
            y:60 + 10,
            radius:10,
            fillStyle:maskColor,
            attachTo:root
        });
        list.addCircle({
            x:70,
            y:70,
            radius:60,
            endAngle:360,
            startAngle: 180,
            stroke:true,
            fill:false,
            lineWidth:20,
            strokeStyle:maskColor,
            attachTo:root
        });
        list.addCircle({
            x:40,
            y:220,
            radius:30,
            endAngle:180,
            startAngle: 0,
            stroke:true,
            fill:false,
            lineWidth:20,
            strokeStyle:maskColor,
            attachTo:root
        });
        list.addCircle({
            x:100,
            y:100,
            radius:30,
            endAngle:180,
            startAngle: 0,
            stroke:true,
            fill:false,
            lineWidth:20,
            strokeStyle:maskColor,
            attachTo:root
        });

        return root;
    }

}